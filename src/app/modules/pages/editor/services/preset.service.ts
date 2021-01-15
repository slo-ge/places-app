import {fabric} from "fabric";
import {ObjectDisplayProperties} from "@app/modules/pages/editor/models";
import {PresetObject, LayoutItemType, Preset} from "@app/core/model/preset";
import {Canvas, Image} from "fabric/fabric-impl";
import {CMS_API_URL} from "@app/core/services/cms.service";
import * as FontFaceObserver from 'fontfaceobserver'
import {
  fabricObjectToPresetObject,
  getYPos,
  ObjectPreset
} from "@app/modules/pages/editor/services/fabric-object.utils";


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


export class PresetService {
  private readonly canvasSettings: ObjectDisplayProperties;
  public readonly layoutSetting: Preset; // TODO: getter and setter
  private readonly canvas: Canvas;
  /**
   * currentObjects which the current canvas holds,
   * this is needed to change and update data for updating presets
   */
  private currentObjects: ObjectPreset[] = [];

  constructor(canvas: Canvas, canvasSettings: ObjectDisplayProperties, layoutSetting: Preset) {
    this.canvas = canvas;
    this.layoutSetting = layoutSetting;
    this.canvasSettings = canvasSettings;
  }


  /**
   * This is the main entry point which draws all layer to the canvas
   */
  async initObjectsOnCanvas() {
    if (this.layoutSetting.backgroundImage) {
      this.setBackground(cmsApiUrl(this.layoutSetting.backgroundImage.url));
      await this.loadFont();
    }

    // clear current items
    if (this.currentObjects.length > 0) {
      this.currentObjects = [];
    }

    if (this.layoutSetting.itemsJson && this.layoutSetting.itemsJson.length > 0) {
      let posLastObjectY = 0; // the position of the last item in canvas

      for (const item of this.layoutSetting.itemsJson.sort((a, b) => a.position < b.position ? -1 : 1)) {
        if (item.type === LayoutItemType.TITLE) {
          const obj = this.createText(this.canvasSettings.title, item, item.offsetTop + posLastObjectY);
          this.addObjectToCanvas(obj, item);
          posLastObjectY = getYPos(obj);

        } else if (item.type === LayoutItemType.DESCRIPTION) {
          const obj = this.createText(this.canvasSettings.description, item, item.offsetTop + posLastObjectY);
          this.addObjectToCanvas(obj, item);
          posLastObjectY = getYPos(obj);

        } else if (item.type === LayoutItemType.IMAGE && this.canvasSettings.image) {
          // TODO: refactore this code
          const proxiedImageUrl = proxiedUrl(this.canvasSettings.image);
          if (!(proxiedImageUrl in imageCache)) {
            const prom = new Promise<Image>((resolve, _reject) => {
              fabric.Image.fromURL(proxiedImageUrl, (img) => resolve(img), {crossOrigin: "*"})
            });
            imageCache[proxiedImageUrl] = await prom;
          }
          const obj = this.createImage(imageCache[proxiedImageUrl], item.offsetTop + posLastObjectY, item);
          this.addObjectToCanvas(obj, item);
          posLastObjectY = getYPos(obj);
        }
      }
    } else {
      console.error('no items to show');
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
      this.canvas.sendToBack(bgImage);
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
        width: (this.canvas.width || 0) - (2 * item.offsetLeft)
      }
    ) as any;

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
   * Sets a given preview image with offset
   *
   * @param image
   * @param offsetTop: the offset always depends on previous item
   * @param item
   */
  createImage(image: Image, offsetTop: number, item: PresetObject) {
    const previewImage = image.set({
      left: item.offsetLeft,
      top: offsetTop
    }) as any;
    previewImage.scaleToWidth(
      (this.canvas.width || 0) - (2 * item.offsetLeft)
    );

    return previewImage;
  }

  /**
   * Adds the object to the canvas
   * Also adds object and item to a list
   */
  addObjectToCanvas(object: fabric.Image | fabric.Textbox, item: PresetObject) {
    this.canvas.add(object);
    this.currentObjects.push({object, item})
  }

  /**
   * returns the current items and
   */
  getCurrentItems() {
    if (this.currentObjects.length === 0) {
      console.error('No  items set to canvas');
    }

    const items = this.currentObjects;
    let posLastObjectY = 0;
    /**
     * always take the bottom line und sub from the top of the object to get a relative
     * space between the items,
     * TODO: please refactor these code to own method
     */
    for (let item of items.sort((a, b) => a.item.position < b.item.position ? -1 : 1)) {
      if (item.object.top) {
        item.object.top = item.object.top - posLastObjectY;
        posLastObjectY = getYPos(item.object);
      }
    }
    return items.map(fabricObjectToPresetObject);
  }
}
