import {fabric} from "fabric";
import {ObjectDisplayProperties} from "@app/modules/pages/editor/models";
import {ExportLatestPresetObject, LayoutItemType, ExportLatestPreset} from "@app/core/model/export-latest-preset";
import {Canvas, Image} from "fabric/fabric-impl";
import {CMS_API_URL} from "@app/core/services/layout-setting.service";
import * as FontFaceObserver from 'fontfaceobserver'


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
function cmsApiUrl(url: string): string {
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

/**
 * get the baseline y coord of fabric object
 * @param obj
 */
function getYPos(obj: any): number {
  return obj?.lineCoords?.bl?.y || 0
}

export class ApplyCanvasObjectPropertiesService {
  private readonly canvasSettings: ObjectDisplayProperties;
  private readonly layoutSetting: ExportLatestPreset;
  private readonly canvas: Canvas;


  constructor(canvas: Canvas, canvasSettings: ObjectDisplayProperties, layoutSetting: ExportLatestPreset) {
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

    if (this.layoutSetting.items && this.layoutSetting.items.length > 0) {
      let posLastObjectY = 0; // the position of the last item in canvas

      for (const item of this.layoutSetting.items.sort((a, b) => a < b ? -1 : 1)) {
        if (item.type === LayoutItemType.TITLE) {
          const obj = this.addText(this.canvasSettings.title, item, item.offsetTop + posLastObjectY);
          posLastObjectY = getYPos(obj);

        } else if (item.type === LayoutItemType.DESCRIPTION) {
          const obj = this.addText(this.canvasSettings.description, item, item.offsetTop + posLastObjectY);
          posLastObjectY = getYPos(obj);

        } else if (item.type === LayoutItemType.IMAGE && this.canvasSettings.image) {
          const proxiedImageUrl = proxiedUrl(this.canvasSettings.image);
          if (!(proxiedImageUrl in imageCache)) {
            const prom = new Promise<Image>((resolve, _reject) => {
              fabric.Image.fromURL(proxiedImageUrl, (img) => resolve(img), {crossOrigin: "*"})
            });
            imageCache[proxiedImageUrl] = await prom;
          }
          const obj = this.setImage(imageCache[proxiedImageUrl], item.offsetTop + posLastObjectY, item.offsetLeft);
          posLastObjectY = getYPos(obj);
        }
      }
    } else {
      console.error('no items to show');
    }
  }

  /**
   * Sets a given preview image with offset
   *
   * @param image
   * @param offsetTop
   * @param offsetLeft
   */
  setImage(image: Image, offsetTop: number, offsetLeft: number) {
    const previewImage = image.set({
      left: offsetLeft,
      top: offsetTop
    }) as any;
    previewImage.scaleToWidth(
      (this.canvas.width || 0) - (2 * offsetLeft)
    );
    this.canvas.add(previewImage);
    return previewImage;
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
  addText(text: string, item: ExportLatestPresetObject, offsetTop: number) {

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

    this.canvas.add(fabricText);
    return fabricText;
  }
}
