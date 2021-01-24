import {fabric} from "fabric";
import {MetaProperties} from "@app/modules/pages/editor/models";
import {LayoutItemType, Preset, PresetObject} from "@app/core/model/preset";
import {Canvas, Image, Object} from "fabric/fabric-impl";
import {CMS_API_URL} from "@app/core/services/cms.service";
import * as FontFaceObserver from 'fontfaceobserver'
import {getYPos, PRESET_TYPE_KEY} from "@app/modules/pages/editor/services/fabric-object.utils";
import {of} from "rxjs";


// This proxy proxies any url and sets the cors origin to * to make
// every content access by browser
const PROXY_URL = 'https://dev-tools.at/proxy';


function proxiedUrl(url: string): string {
  return `${PROXY_URL}/${url}`
}

/**
 * because every CMS URL is relative to CMS, so we need to append the api url
 * @param url
 */
export function cmsApiUrl(url: string): string {
  // url always starts with "/"
  return `${CMS_API_URL}${url}`;
}

/**
 * This is a simple cache which does only cache the images,
 * and nothing else, to prevent the app doing multiple calls
 * against the rest-api
 */
const imageCache: { [key: string]: Image } = {};


/**
 * this functions appends a new font face to the app
 * @param fontFileUrl
 * @param fontFamily
 */
function appendFontToDom(fontFileUrl: string, fontFamily: string) {
  const absoluteFontFileUrl = cmsApiUrl(fontFileUrl);
  const CSS = `@font-face {
  font-family: '${fontFamily}';
  src: url('${absoluteFontFileUrl}') format('woff'),
       url('${absoluteFontFileUrl}') format('woff2');
  }`;
  const head = document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(CSS));
  head.appendChild(style);
}

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
        if (item.type === LayoutItemType.TITLE || item.type === LayoutItemType.DESCRIPTION) {

          const text = item.type === LayoutItemType.TITLE
            ? this.metaProperties.title
            : this.metaProperties.description;

          const obj = this.createText(text, item, item.offsetTop + posLastObjectY);
          this.addObjectToCanvas(obj);
          renderedItems.push({object: obj, preset: item});
          posLastObjectY = getYPos(obj);

        } else if (item.type === LayoutItemType.IMAGE && this.metaProperties.image) {
          const image = fabric.util.object.clone(await this.getImage());
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
      console.log('loaded font', this.layoutSetting.fontFamilyHeadingCSS,
        'from file', this.layoutSetting.fontFileWoff)
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
        fontSize: item.fontSize,
        left: item.offsetLeft,
        top: offsetTop,
        width: (this.canvas.width || 0) - (2 * item.offsetLeft),
      }
    ) as any;

    this.setObjectAttributes(fabricText, item);

    fabricText[PRESET_TYPE_KEY] = item.type;

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

    return fabricText;
  }

  /**
   * returns image from cache or null
   */
  public async getImage() {
    if (this.metaProperties.image) {
      const proxiedImageUrl = proxiedUrl(this.metaProperties.image);
      if (!(proxiedImageUrl in imageCache)) {
        const prom = new Promise<Image>((resolve, _reject) => {
          fabric.Image.fromURL(proxiedImageUrl, (img) => resolve(img), {crossOrigin: "*"})
        });
        imageCache[proxiedImageUrl] = await prom;

      }
      return imageCache[proxiedImageUrl];
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
    const fabricImage = image.set({
      left: item.offsetLeft,
      top: offsetTop
    }) as any;
    this.setObjectAttributes(fabricImage, item);
    fabricImage.scaleToWidth(
      (this.canvas.width || 0) - (2 * item.offsetLeft)
    );
    fabricImage[PRESET_TYPE_KEY] = item.type;

    return fabricImage;
  }

  /**
   * Set object overlapping attributes
   *
   * @param fabricObject can be text or image
   * @param item
   */
  setObjectAttributes(fabricObject: Object, item: PresetObject) {
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
