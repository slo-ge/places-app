import { fabric } from 'fabric';
import { MetaMapperData } from '@app/modules/pages/editor/models';
import { LayoutItemType, ObjectPosition, Preset, PresetObject, PresetObjectStaticImage } from '@app/core/model/preset';
import { Canvas, Image, Object } from 'fabric/fabric-impl';
import * as FontFaceObserver from 'fontfaceobserver';
import {
    CustomCircleObject,
    CustomImageBox,
    CustomObject,
    CustomRectObject,
    CustomTextBox,
    getMetaFieldOrStaticField,
    getYPos,
    isCircle,
    isImage,
    isPositionXFixed,
    isPositionYFixed,
    isRect,
    isText,
} from '@app/core/editor/fabric-object.utils';
import {
    appendFontToDom,
    isAbsoluteUrl,
    isVideoBackground,
    proxiedUrl,
    resetFabricImage,
    toAbsoluteCMSUrl,
} from '@app/core/editor/utils';
import { PresetVideo } from '@app/core/editor/preset-video.service';
import {
    CIRCLE_RESOLVERS,
    OBJECT_RESOLVERS,
    RECT_RESOLVERS,
    TEXT_RESOLVERS,
} from '@app/core/editor/resolvers/resolvers';
import { FontResolver } from '@app/core/editor/resolvers/font.resolver';

/**
 * This is a simple cache which does only cache the images,
 * and nothing else, to prevent the app doing multiple calls
 * against the rest-api
 */
const imageCache: { [key: string]: Image } = {};

// Change the padding logic to include background-color
fabric.Text.prototype.set({
    _getNonTransformedDimensions() {
        // Object dimensions
        // @ts-ignore
        return new fabric.Point(this.width, this.height).scalarAdd(this.padding);
    },
    // @ts-ignore
    _calculateCurrentDimensions() {
        // Controls dimensions
        // @ts-ignore
        return fabric.util.transformPoint(this._getTransformedDimensions(), this.getViewportTransform(), true);
    },
});

/**
 * store fabricjs object with corresponding preset
 */
interface FabricObjectAndPreset {
    object: any;
    preset: PresetObject;
}

/**
 * Infos Which do the presetService holds
 */
interface PresetServiceInfo {
    isAnimatedBackground?: boolean;
}

/**
 * Sort by there vertical position
 */
const POSITION_SORT = (a: PresetObject, b: PresetObject) => (a.position < b.position ? -1 : 1);

export class PresetService {
    public readonly metaMapperData: MetaMapperData;
    public readonly preset: Preset; // TODO: getter and setter
    public readonly canvas: Canvas;
    public info: PresetServiceInfo = {};

    constructor(canvas: Canvas, metaMapperData: MetaMapperData, preset: Preset) {
        this.canvas = canvas;
        this.preset = preset;
        this.metaMapperData = metaMapperData;
    }

    /**
     * This is the main entry point which draws all layer to the canvas
     */
    public async initObjectsOnCanvas() {
        if (this.preset.backgroundImage) {
            // video/mp4 -> TODO: use enum
            await this.setBackground(toAbsoluteCMSUrl(this.preset.backgroundImage.url));
            await this.loadGlobalFontFromLayoutSetting();
        }

        // Holds all fabricJs objects for setting the correct zIndex
        const renderedItems: FabricObjectAndPreset[] = [];

        if (this.preset.itemsJson && this.preset.itemsJson.length > 0) {
            let posLastObjectY = 0; // the position of the last item in canvas

            const apply = (obj: fabric.Object, item: PresetObject) => {
                this.applyOptions(obj, item, item.offsetTop + posLastObjectY);
                this.addObjectToCanvas(obj);
                renderedItems.push({ object: obj, preset: item });
                posLastObjectY = getYPos(obj); // side effect, but helps if positions are relative to their object size
            };

            for (const preset of this.preset.itemsJson.sort(POSITION_SORT)) {
                let obj: fabric.Object | null = null;
                if (isText(preset)) {
                    const text = getMetaFieldOrStaticField(this.metaMapperData, preset);
                    obj = await this.createText(text, preset, preset.offsetTop + posLastObjectY);
                } else if (isImage(preset)) {
                    const url = getMetaFieldOrStaticField(this.metaMapperData, preset);
                    obj = fabric.util.object.clone(await this.getImage(url));
                } else if (isCircle(preset)) {
                    obj = new fabric.Circle();
                    CIRCLE_RESOLVERS.applyOnObject(obj as CustomCircleObject, preset);
                } else if (isRect(preset)) {
                    obj = new fabric.Rect();
                    RECT_RESOLVERS.applyOnObject(obj as CustomRectObject, preset);
                }

                if (obj) {
                    apply(obj, preset);
                } else {
                    console.error(`Could not apply object with type ${preset.type} in preset: ${this.preset.id}`);
                }
            }
        } else {
            console.error('no items to show');
        }

        /**
         * after adding all objects to the canvas, we can now change the zIndex of every layer.
         * This can only be done, when all objects in the canvas, otherwise, we would automatically
         * adjust all the zIndex of created objects.
         * If no objects on canvas, we can not set the zIndex to i.e. level=3
         * But if 3 items on canvas, we can change it to 3, so we need to render first, and also
         * keep the order of the zIndex if available
         */
        for (const item of renderedItems.sort((a, b) => ((a.preset.zIndex || 0) < (b.preset.zIndex || 0) ? -1 : 1))) {
            this.afterAddToCanvasAttributes(item.object, item.preset);
        }
    }

    /**
     * Adds the object to the canvas
     * Also adds object and item to a list
     */
    public addObjectToCanvas(
        object: fabric.Image | fabric.Textbox | fabric.Rect | fabric.Circle,
        selected: boolean = false
    ) {
        this.canvas.add(object);
        if (selected) {
            this.canvas.setActiveObject(object);
        }
    }

    public createImage(image: CustomImageBox, offsetTop: number, item: PresetObject) {
        this.applyOptions(image, item, offsetTop);
        return image;
    }

    /**
     * returns image from cache or null,
     * use proxy uses the proxy service to download images directly to canvas,
     * this problem does not exist if any image is uploaded locally directly to fabric canvas
     * so we do need to skip the using proxy url step
     */
    public async getImage(url: string, useProxy: boolean = true) {
        // if the url starts with blob, it is a preselected or taken photo,
        // used by the @ImageUploadContentAdapter,
        // also ignore proxy if there is no absolute url, because its internal content
        useProxy = url.startsWith('blob:') || !isAbsoluteUrl(url) ? false : useProxy;

        if (url) {
            const proxiedImageUrl = useProxy ? proxiedUrl(url) : url;

            if (!(proxiedImageUrl in imageCache)) {
                const prom = new Promise<Image>((resolve, _reject) => {
                    fabric.Image.fromURL(proxiedImageUrl, img => resolve(img), { crossOrigin: '*' });
                });

                imageCache[proxiedImageUrl] = fabric.util.object.clone(await prom);
            }

            // clear image
            return resetFabricImage(imageCache[proxiedImageUrl]);
        }

        console.error('Can not create image, if no URL is set, returning NULL');
        return null;
    }

    /**
     * Set the background image or the video to the whole canvas layer,
     * the background image is not selectable and so, it can not be
     * removed
     * @param url
     */
    private async setBackground(url: string) {
        if (isVideoBackground(this.preset)) {
            this.info.isAnimatedBackground = true;
            this.setAnimatedBackground(url);
        } else {
            // add static background
            let image = await this.getImage(url);
            if (image) {
                image.scaleToWidth(this.canvas.width as number);
                image.selectable = false;
                image.lockMovementX = true;
                image.lockMovementY = true;
                image.moveTo(0);
                this.canvas.add(image);
            }
        }
    }

    private setAnimatedBackground(url: string) {
        PresetVideo.initializeVideo(this.canvas, url, this.preset);
    }

    /**
     * check if a certain font is set and load the font
     */
    private async loadGlobalFontFromLayoutSetting() {
        if (this.preset.fontFamilyHeadingCSS && this.preset.fontFileWoff) {
            appendFontToDom(this.preset.fontFileWoff.url, this.preset.fontFamilyHeadingCSS);

            const font = new FontFaceObserver(this.preset.fontFamilyHeadingCSS);
            await font.load(null, 5000);
        }
    }

    /**
     * This function renders the fabricJs text to the canvas with given
     * parameters.
     * @param text, the text from preview
     * @param item, the config from item
     * @param offsetTop
     */
    public async createText(text: string, item: PresetObject, offsetTop: number) {
        const fabricText = new fabric.Textbox(text, { fontSize: item.fontSize, left: 10, top: 10 }) as
            | any
            | CustomTextBox;

        // NOTE: This is also set in this.applyOptions
        fabricText.presetType = item.type;

        // Apply resolvers to the preset
        TEXT_RESOLVERS.forEach(r => r.applyOnObject(fabricText, item));
        // TODO: this needs to be refactored to FontResolver
        if (item.font) {
            await FontResolver.loadFontFromPresetItem(item.font, fabricText);
        }

        // this can not be changed in editor at the moment
        if (!item.font && this.preset.fontFamilyHeadingCSS) {
            fabricText.set('fontFamily', this.preset.fontFamilyHeadingCSS);
        }

        return fabricText;
    }

    /**
     * Set object overlapping attributes,
     * also set the "data" type (i.e. title, description, price) to the object
     */
    private applyOptions(fabricObject: CustomObject, preset: PresetObject, offsetTop: number) {
        fabricObject.set('left', preset.offsetLeft);

        if (isPositionYFixed(preset)) {
            fabricObject.set('top', preset.offsetTop);
        } else {
            // else use the relative position
            fabricObject.set('top', offsetTop);
        }

        // setting the x position and calculating the width
        let width = (this.canvas.width || 0) - 2 * preset.offsetLeft;
        if (isPositionXFixed(preset)) {
            let offsetRight = preset.offsetRight || preset.offsetLeft;
            width = (this.canvas.width || 0) - preset.offsetLeft - offsetRight;
        }

        // depending on type set the width with the correct operation,
        // we give the image a dynamic width
        if (isImage(preset)) {
            fabricObject.scaleToWidth(width);
        } else if (!isCircle(preset) && !isRect(preset)) {
            fabricObject.set('width', width);
        }

        // setting the preset[Variable] to object, to read it if persisting
        fabricObject.presetType = preset.type;
        fabricObject.presetObjectPosition = preset.objectPosition || ObjectPosition.RELATIVE; // setting the y position
        if (preset.type === LayoutItemType.STATIC_IMAGE) {
            fabricObject.presetStaticImageUrl = (preset as PresetObjectStaticImage).image.url;
        }

        if (preset.objectAngle) {
            fabricObject.set('angle', preset.objectAngle);
        }

        OBJECT_RESOLVERS.forEach(r => r.applyOnObject(fabricObject, preset));
    }

    /**
     * some object operations can only be done after object is painted on canvas
     */
    private afterAddToCanvasAttributes(fabricObject: Object, item: PresetObject) {
        if (item.zIndex) {
            this.canvas.moveTo(fabricObject, item.zIndex);
            fabricObject.moveTo(item.zIndex);
            this.canvas.renderAll();
        }
    }
}
