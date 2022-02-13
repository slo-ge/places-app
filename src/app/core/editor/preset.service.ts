import {fabric} from "fabric";
import {MetaMapperData} from "@app/modules/pages/editor/models";
import {LayoutItemType, ObjectPosition, Preset, PresetObject, PresetObjectStaticImage} from "@app/core/model/preset";
import {Canvas, Image, Object} from "fabric/fabric-impl";
import * as FontFaceObserver from 'fontfaceobserver'
import {
  CustomObject,
  CustomTextBox,
  getMetaFieldOrStaticField,
  getYPos,
  isImage,
  isPositionXFixed,
  isPositionYFixed,
  isText
} from "@app/core/editor/fabric-object.utils";
import {
  appendFontToDom,
  isAbsoluteUrl,
  isVideoBackground,
  proxiedUrl,
  resetFabricImage,
  toAbsoluteCMSUrl
} from "@app/core/editor/utils";
import {PresetVideo} from "@app/core/editor/preset-video.service";
import {TEXT_RESOLVERS} from "@app/core/editor/resolvers/resolvers";
import {FontResolver} from "@app/core/editor/resolvers/font.resolver";


/**
 * This is a simple cache which does only cache the images,
 * and nothing else, to prevent the app doing multiple calls
 * against the rest-api
 */
const imageCache: { [key: string]: Image } = {};

// Change the padding logic to include background-color
fabric.Text.prototype.set({
  _getNonTransformedDimensions() { // Object dimensions
    // @ts-ignore
    return new fabric.Point(this.width, this.height).scalarAdd(this.padding);
  },
  // @ts-ignore
  _calculateCurrentDimensions() { // Controls dimensions
    return fabric.util.transformPoint(this._getTransformedDimensions(), this.getViewportTransform(), true);
  }
});

/**
 * store fabricjs object with corresponding preset
 */
interface FabricObjectAndPreset {
  object: any,
  preset: PresetObject
}

/**
 * Infos Which do the presetService holds
 */
interface PresetServiceInfo {
  isAnimatedBackground?: boolean;
}

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
      this.setBackground(toAbsoluteCMSUrl(this.preset.backgroundImage.url));
      await this.loadGlobalFontFromLayoutSetting();
    }

    // holds all fabricJs objects for setting the correct zIndex
    const renderedItems: FabricObjectAndPreset[] = [];

    if (this.preset.itemsJson && this.preset.itemsJson.length > 0) {
      let posLastObjectY = 0; // the position of the last item in canvas
      for (const item of this.preset.itemsJson.sort((a, b) => a.position < b.position ? -1 : 1)) {
        if (isText(item)) {
          const text = getMetaFieldOrStaticField(this.metaMapperData, item);
          const obj = await this.createText(text, item, item.offsetTop + posLastObjectY);

          this.addObjectToCanvas(obj);
          renderedItems.push({object: obj, preset: item});
          posLastObjectY = getYPos(obj);

        } else if (isImage(item)) {
          const url = getMetaFieldOrStaticField(this.metaMapperData, item);
          const image = fabric.util.object.clone(await this.getImage(url));
          this.applyOptions(image, item, item.offsetTop + posLastObjectY);
          this.addObjectToCanvas(image);
          renderedItems.push({object: image, preset: item});
          posLastObjectY = getYPos(image);
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
    for (const item of renderedItems.sort((a, b) =>
      (a.preset.zIndex || 0) < (b.preset.zIndex || 0) ? -1 : 1)
      ) {
      this.afterAddToCanvasAttributes(item.object, item.preset);
    }
  }

  /**
   * Adds the object to the canvas
   * Also adds object and item to a list
   */
  public addObjectToCanvas(object: fabric.Image | fabric.Textbox) {
    this.canvas.add(object);
  }

  public createImage(image: Image, offsetTop: number, item: PresetObject) {
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
    // if the url starts with blob, it is a pre selected or taken photo,
    // used by the @ImageUploadContentAdapter,
    // also ignore proxy if there is no absolute url, because its internal content
    useProxy = (url.startsWith('blob:') || !isAbsoluteUrl(url)) ? false : useProxy;

    if (url) {
      const proxiedImageUrl = useProxy ? proxiedUrl(url) : url;

      if (!(proxiedImageUrl in imageCache)) {
        const prom = new Promise<Image>((resolve, _reject) => {
          fabric.Image.fromURL(proxiedImageUrl, (img) => resolve(img), {crossOrigin: "*"})
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
  private setBackground(url: string) {
    if (isVideoBackground(this.preset)) {
      this.info.isAnimatedBackground = true;
      this.setAnimatedBackground(url);
    } else {
      this.setStaticBackground(url);
    }
  }

  private async setStaticBackground(url: string) {
    fabric.Image.fromURL(url, (myImg) => {
      const bgImage = myImg.set({left: 0, top: 0, selectable: false}) as any;
      bgImage.scaleToWidth(this.canvas.width);
      bgImage.lockMovementX = true;
      bgImage.lockMovement = true;
      this.canvas.moveTo(bgImage, 0);
    }, {crossOrigin: "*"});
  }

  private setAnimatedBackground(url: string) {
    PresetVideo.initializeVideo(this.canvas, url, this.preset);
  }

  /**
   * check if a certain font is set and load the font
   */
  private async loadGlobalFontFromLayoutSetting() {
    if (this.preset.fontFamilyHeadingCSS && this.preset.fontFileWoff) {
      appendFontToDom(
        this.preset.fontFileWoff.url,
        this.preset.fontFamilyHeadingCSS
      );

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
  private async createText(text: string, item: PresetObject, offsetTop: number) {
    const fabricText = new fabric.Textbox(
      text, {fontSize: item.fontSize, left: 10, top: 10}
    ) as any | CustomTextBox;
    this.applyOptions(fabricText, item, offsetTop);

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
  private applyOptions(fabricObject: CustomObject, item: PresetObject, offsetTop: number) {
    fabricObject.set('left', item.offsetLeft);

    if (isPositionYFixed(item)) {
      fabricObject.set('top', item.offsetTop)
    } else {
      // else use the relative position
      fabricObject.set('top', offsetTop);
    }

    // setting the x position and calculating the width
    let width = (this.canvas.width || 0) - (2 * item.offsetLeft);
    if (isPositionXFixed(item)) {
      let offsetRight = item.offsetRight || item.offsetLeft;
      width = (this.canvas.width || 0) - item.offsetLeft - offsetRight;
    }

    // depending on type set the width with the correct operation
    if (isImage(item)) {
      fabricObject.scaleToWidth(width);
    } else {
      fabricObject.set('width', width);
    }

    // setting the preset[Variable] to object, to read it if persisting
    fabricObject.presetType = item.type;
    fabricObject.presetObjectPosition = item.objectPosition || ObjectPosition.RELATIVE; // setting the y position
    if (item.type === LayoutItemType.STATIC_IMAGE) {
      fabricObject.presetStaticImageUrl = (item as PresetObjectStaticImage).image.url;
    }

    if (item.objectAngle) {
      fabricObject.set('angle', item.objectAngle);
    }
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
