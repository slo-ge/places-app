import {Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges} from '@angular/core';
import {SimplePreviewCanvasSetting} from "@app/modules/pages/editor/models";
import {fabric} from "fabric";
import {LayoutSetting} from "@app/core/model/layout-setting";
import {CMS_API_URL} from "@app/core/services/layout-setting.service";


const DEFAULT_SETTING: LayoutSetting = {
  height: 1600,
  width: 900,
  fontHeadingSizePixel: 80,
  fontTextSizePixel: 40
};

function mergeLayouts(layout: LayoutSetting, defaultLayout = DEFAULT_SETTING) {
  const config = {
    ...DEFAULT_SETTING,
    ...layout,
    fontHeadingSizePixel: layout.fontHeadingSizePixel || defaultLayout.fontHeadingSizePixel,
    fontTextSizePixel: layout.fontTextSizePixel || defaultLayout.fontTextSizePixel
  };
  console.log(config);
  return config;
}

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


function appendStyle(url: string) {
  url = cmsApiUrl(url);
  console.log(url);
  //url = 'https://fonts.gstatic.com/s/nerkoone/v1/m8JQjfZSc7OXlB3ZMOjDeZRAVmo.woff2';
  const CSS = `
@font-face {
  font-family: 'test';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(${url}) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

body {
  font-family: 'test', Garamond, serif !important;
}
`;

  const head = document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(CSS));
  head.appendChild(style);
}

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnChanges {
  @Input()
  canvasSettings: SimplePreviewCanvasSetting = {} as any;
  layoutSetting: LayoutSetting = {} as any;
  canvas: any;

  paddingSides = 40;
  paddingTop = 80;

  constructor(private currentComponentElemRef: ElementRef) {
  }

  ngOnChanges(data: SimpleChanges): void {
    this.refreshCanvas();
  }

  setLayout($event: LayoutSetting) {
    this.layoutSetting = $event;
    this.refreshCanvas();
  }

  refreshCanvas() {
    if (this.canvas == null) {
      this.canvas = new fabric.Canvas('myCanvas');
    } else {
      this.canvas.clear();
    }

    this.layoutSetting = mergeLayouts(this.layoutSetting);

    if (this.canvasSettings) {
      this.canvas.setHeight(this.layoutSetting.height);
      this.canvas.setWidth(this.layoutSetting.width);
      this.canvas.renderAll();

      if (this.layoutSetting.backgroundImage) {
        this.setBackground(cmsApiUrl(this.layoutSetting.backgroundImage.url));
      }

      if (this.canvasSettings.image) {
        fabric.Image.fromURL(proxiedUrl(this.canvasSettings.image), (myImg) => {
          const img1 = myImg.set({left: this.paddingSides, top: this.paddingTop}) as any;
          img1.scaleToWidth(this.canvas.width - 2 * this.paddingSides);
          this.canvas.add(img1);
          this.addTexts(img1);
        }, {crossOrigin: "*"});
      } else {
        this.addTexts(null);
      }
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
      const img1 = myImg.set({left: 0, top: 0, selectable: false}) as any;
      img1.scaleToWidth(this.canvas.width);
      img1.lockMovementX = true;
      img1.lockMovement = true;
      this.canvas.sendToBack(img1);
    }, {crossOrigin: "*"});
  }

  /**
   * This function adds the text layers and calculats
   * the y position be a given object
   * @param fabricJsObject
   */
  addTexts(fabricJsObject: any) {
    const textOffset = fabricJsObject?.lineCoords?.bl?.y + 30 || 0;
    const headingText = this.addText(
      this.canvasSettings.title,
      textOffset,
      this.layoutSetting.fontHeadingSizePixel,
      this.layoutSetting.fontFamilyHeadingCSS
    );

    this.addText(
      this.canvasSettings.description,
      headingText.lineCoords.bl.y + this.paddingTop,
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
   */
  addText(text: string, yPosition: number, fontSize: number, fontFamily?: string) {
    const padding = this.paddingSides;
    let fabricText = new fabric.Textbox(
      this.canvasSettings.title,
      {
        fontSize: fontSize,
        left: padding,
        top: yPosition,
        width: this.canvas.width - 2 * padding
      }
    ) as any;

    if (fontFamily) {
      fabricText.set('fontFamily', fontFamily);
    }
    this.canvas.add(fabricText);
    return fabricText;
  }


  /**
   * Generate a downloadable image
   */
  download() {
    let canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const link = document.createElement('a');
    link.download = 'filename.png';
    link.href = canvas.toDataURL();
    link.click();
  }


  @HostListener('document:click', ['$event'])
  deselectListener(event$: any) {
    if (!this.currentComponentElemRef.nativeElement.contains(event?.target)) {
      this.canvas.discardActiveObject().renderAll();
    }
  }

}
