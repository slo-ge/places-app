import {fabric} from "fabric";
import {MetaProperties} from "@app/modules/pages/editor/models";
import {ObjectPosition, Preset, PresetObject} from "@app/core/model/preset";
import {Canvas, Image, Object} from "fabric/fabric-impl";
import * as FontFaceObserver from 'fontfaceobserver'
import {
  CustomObject,
  getMetaField,
  getYPos,
  isImage,
  isText
} from "@app/modules/pages/editor/services/fabric-object.utils";
import {appendFontToDom, cmsApiUrl, importFontInDom, proxiedUrl} from "@app/modules/pages/editor/services/utils";


/**
 * This is a simple cache which does only cache the images,
 * and nothing else, to prevent the app doing multiple calls
 * against the rest-api
 */
const imageCache: { [key: string]: Image } = {};


interface FabricObjectAndPreset {
  object: any,
  preset: PresetObject
}

export class PresetService {
  private readonly metaProperties: MetaProperties;
  public readonly layoutSetting: Preset; // TODO: getter and setter
  private readonly canvas: Canvas;

  /**
   * currentObjects which the current canvas holds,
   * this is needed to change and update data for updating presets
   */

  constructor(canvas: Canvas, metaProperties: MetaProperties, layoutSetting: Preset) {
    this.canvas = canvas;
    this.layoutSetting = layoutSetting;
    this.metaProperties = metaProperties;
  }


  /**
   * This is the main entry point which draws all layer to the canvas
   */
  async initObjectsOnCanvas() {
    if (this.layoutSetting.backgroundImage) {
      this.setBackground(cmsApiUrl(this.layoutSetting.backgroundImage.url));
      await this.loadFont();
    }

    const renderedItems: FabricObjectAndPreset[] = [];

    if (this.layoutSetting.itemsJson && this.layoutSetting.itemsJson.length > 0) {
      let posLastObjectY = 0; // the position of the last item in canvas
      for (const item of this.layoutSetting.itemsJson.sort((a, b) => a.position < b.position ? -1 : 1)) {
        if (isText(item)) {

          const text = getMetaField(this.metaProperties, item.type);
          const obj = this.createText(text, item, item.offsetTop + posLastObjectY);

          this.addObjectToCanvas(obj);
          renderedItems.push({object: obj, preset: item});
          posLastObjectY = getYPos(obj);

        } else if (isImage(item)) {
          const url = getMetaField(this.metaProperties, item.type);
          const image = fabric.util.object.clone(await this.getImage(url));
          const obj = this.createImage(image, item.offsetTop + posLastObjectY, item);
          this.addObjectToCanvas(obj);
          renderedItems.push({object: obj, preset: item});
          posLastObjectY = getYPos(obj);
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
   * Set the background image to the whole canvas layer,
   * the background image is not selectable and so, it can not be
   * removed
   * @param url
   */
  setBackground(url: string) {
    fabric.Image.fromURL(url, (myImg) => {
      const bgImage = myImg.set({left: 0, top: 0, selectable: false}) as any;
      bgImage.scaleToWidth(this.canvas.width);
      bgImage.lockMovementX = true;
      bgImage.lockMovement = true;
      this.canvas.moveTo(bgImage, 0);
    }, {crossOrigin: "*"});
  }

  /**
   * check if a certain font is set and load the font
   */
  async loadFont() {
    if (this.layoutSetting.fontFamilyHeadingCSS && this.layoutSetting.fontFileWoff) {
      appendFontToDom(
        this.layoutSetting.fontFileWoff.url,
        this.layoutSetting.fontFamilyHeadingCSS
      );

      const font = new FontFaceObserver(this.layoutSetting.fontFamilyHeadingCSS);
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
  createText(text: string, item: PresetObject, offsetTop: number) {
    let fabricText = new fabric.Textbox(
      text,
      {
        fontSize: item.fontSize
      }
    ) as any;
    this.setObjectAttributes(fabricText, item, offsetTop);

    if (item.fontColor) {
      fabricText.set('fill', item.fontColor);
    }

    if (this.layoutSetting.fontFamilyHeadingCSS) {
      fabricText.set('fontFamily', this.layoutSetting.fontFamilyHeadingCSS);
    }

    if (item.fontWeight) {
      fabricText.set('fontWeight', item.fontWeight);
    }

    if (item.fontLineHeight) {
      fabricText.set('lineHeight', item.fontLineHeight);
    }

    if (item.fontLetterSpacing) {
      fabricText.set('charSpacing', item.fontLetterSpacing);
    }

    if (item.font){
      const fontObserver = new FontFaceObserver(item.font.fontName);
      importFontInDom(item.font);
      fontObserver.load(item.font.fontFamily, 5000).then(
        () => fabricText.set('fontFamily', item.font?.fontFamily),
        (e) => console.error(e)
      );
    }

    return fabricText;
  }

  /**
   * returns image from cache or null
   */
  public async getImage(url: string) {
    if (url) {
      const proxiedImageUrl = proxiedUrl(url);
      if (!(proxiedImageUrl in imageCache)) {
        const prom = new Promise<Image>((resolve, _reject) => {
          fabric.Image.fromURL(proxiedImageUrl, (img) => resolve(img), {crossOrigin: "*"})
        });
        imageCache[proxiedImageUrl] = await prom;
      }
      return imageCache[proxiedImageUrl];
    } else {
      console.error('Can not create image, if no URL is set, returning NULL');
    }
    return null;
  }

  /**
   * Sets a given preview image with offset
   * TODO: maybe this can be refactored
   *
   * @param image
   * @param offsetTop: the offset always depends on previous item
   * @param item
   */
  public createImage(image: Image, offsetTop: number, item: PresetObject) {
    this.setObjectAttributes(image, item, offsetTop);
    return image;
  }

  /**
   * Set object overlapping attributes
   *
   * @param fabricObject can be text or image
   * @param item
   * @param offsetTop
   */
  private setObjectAttributes(fabricObject: CustomObject, item: PresetObject, offsetTop: number) {
    fabricObject.set('left', item.offsetLeft);
    fabricObject.set('top', offsetTop);


    fabricObject.presetType = item.type;
    fabricObject.presetObjectPosition = item.objectPosition || ObjectPosition.RELATIVE;

    let width = (this.canvas.width || 0) - (2 * item.offsetLeft);
    if (item.objectPosition === ObjectPosition.ABSOLUTE) {
      let offsetRight = item.offsetRight || item.offsetLeft;
      width = (this.canvas.width || 0) - item.offsetLeft - offsetRight;
    }

    if (isImage(item)) {
      fabricObject.scaleToWidth(width);
    } else {
      fabricObject.set('width', width);
    }


    if (item.objectAngle) {
      fabricObject.set('angle', item.objectAngle);
    }

  }

  /**
   * some object operations can only be done after object is painted on canvas
   * @param fabricObject
   * @param item
   */
  afterAddToCanvasAttributes(fabricObject: Object, item: PresetObject) {
    if (item.zIndex) {
      this.canvas.moveTo(fabricObject, item.zIndex);
      fabricObject.moveTo(item.zIndex);
      this.canvas.renderAll();
    }
  }

  /**
   * Adds the object to the canvas
   * Also adds object and item to a list
   */
  addObjectToCanvas(object: fabric.Image | fabric.Textbox) {
    this.canvas.add(object);
  }
}
