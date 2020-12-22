import {fabric} from "fabric";
import {ObjectDisplayProperties} from "@app/modules/pages/editor/models";
import {LayoutSetting} from "@app/core/model/layout-setting";
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

export class ApplyCanvasObjectPropertiesService {
  private readonly paddingTop = 80;

  private readonly canvasSettings: ObjectDisplayProperties;
  private readonly layoutSetting: LayoutSetting;
  private readonly canvas: Canvas;


  constructor(canvas: Canvas, canvasSettings: ObjectDisplayProperties, layoutSetting: LayoutSetting) {
    this.canvas = canvas;
    this.layoutSetting = layoutSetting;
    this.canvasSettings = canvasSettings;
  }

  /**
   * This is the main entry point which draws all layer to the canvas
   */
  initObjectsOnCanvas() {
    if (this.layoutSetting.backgroundImage) {
      this.setBackground(cmsApiUrl(this.layoutSetting.backgroundImage.url));
    }

    if (this.canvasSettings.image) {
      const proxiedImageUrl = proxiedUrl(this.canvasSettings.image);

      // Try to get image from cache
      if (imageCache[proxiedImageUrl]) {
        this.addImageAndTexts(imageCache[proxiedImageUrl]);
      } else {
        fabric.Image.fromURL(proxiedImageUrl, (image) => {
          imageCache[proxiedImageUrl] = image;
          this.addImageAndTexts(image);
        }, {crossOrigin: "*"});
      }

    } else {
      this.addTexts(null);
    }
  }

  /**
   * render the image on the canvas and then
   * render the texts to the canvas
   * @param image
   */
  addImageAndTexts(image: Image) {
    const previewImage = image.set({
      left: this.layoutSetting.offsetSides,
      top: this.layoutSetting.offsetTop || this.paddingTop
    }) as any;
    previewImage.scaleToWidth(
      (this.canvas.width || 0) - 2 * (this.layoutSetting.offsetSides || 0)
    );
    this.canvas.add(previewImage);
    this.addTexts(previewImage);
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
   * This function adds the text layers and calculats
   * the y position be a given object
   * @param fabricJsObject
   */
  async addTexts(fabricJsObject: any) {
    if (this.layoutSetting.fontFamilyHeadingCSS && this.layoutSetting.fontFileWoff) {
      appendFontToDom(
        this.layoutSetting.fontFileWoff.url,
        this.layoutSetting.fontFamilyHeadingCSS
      );

      const font = new FontFaceObserver(this.layoutSetting.fontFamilyHeadingCSS);
      await font.load(null, 5000);
    }

    const textOffset = fabricJsObject?.lineCoords?.bl?.y + this.layoutSetting.offsetImageBottom;
    const headingText = this.addText(
      this.canvasSettings.title,
      textOffset,
      this.layoutSetting.fontHeadingSizePixel,
      this.layoutSetting.fontFamilyHeadingCSS,
      'bold'
    );

    this.addText(
      this.canvasSettings.description,
      headingText.lineCoords.bl.y + this.layoutSetting.offsetImageBottom,
      this.layoutSetting.fontTextSizePixel,
      this.layoutSetting.fontFamilyTextCSS
    );
  }

  /**
   * This function renders the fabricJs text to the canvas with given
   * parameters.
   * @param text
   * @param yPosition
   * @param fontSize
   * @param fontFamily
   * @param fontWeight
   */
  addText(text: string, yPosition: number, fontSize: number, fontFamily?: string, fontWeight?: string) {
    const padding = this.layoutSetting.offsetSides || 0;
    let fabricText = new fabric.Textbox(
      text,
      {
        fontSize: fontSize,
        left: padding,
        top: yPosition,
        width: (this.canvas.width || 0) - 2 * padding
      }
    ) as any;

    if (fontFamily) {
      fabricText.set('fontFamily', fontFamily);
    }

    if (fontWeight) {
      fabricText.set('fontWeight', fontWeight);
    }

    if (this.layoutSetting.fontLineHeight) {
      fabricText.set('lineHeight', this.layoutSetting.fontLineHeight);
    }

    if (this.layoutSetting.fontLetterSpacing) {
      fabricText.set('charSpacing', this.layoutSetting.fontLetterSpacing);
    }

    this.canvas.add(fabricText);
    return fabricText;
  }

}
