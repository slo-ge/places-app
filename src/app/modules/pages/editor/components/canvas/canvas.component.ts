import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {SimplePreviewCanvasSetting} from "@app/modules/pages/editor/models";
import {fabric} from "fabric";
import {LayoutSetting} from "@app/core/model/layout-setting";
import {CMS_API_URL} from "@app/core/services/layout-setting.service";



const DEFAULT_SETTING: LayoutSetting = {
  height: 1600,
  width: 900,
  fontHeadingSizePixel: 40,
  fontTextSizePixel: 20
};

function mergeLayouts(layout: LayoutSetting, defaultLayout = DEFAULT_SETTING) {
  return {
    ...DEFAULT_SETTING,
    ...layout,
    fontHeadingSizePixel: layout.fontHeadingSizePixel || defaultLayout.fontTextSizePixel,
    fontTextSizePixel: layout.fontTextSizePixel || defaultLayout.fontTextSizePixel
  }
}

// This proxy proxies any url and sets the cors origin to * to make
// every content access by browser
const PROXY_URL = 'https://cors-anywhere.herokuapp.com';
function proxiedUrl(url: string):string {
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

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnChanges {
  @Input()
  canvasSettings: SimplePreviewCanvasSetting = {} as any;
  @Input()
  layoutSetting: LayoutSetting = {} as any;
  canvas: any;

  constructor() {
  }

  ngOnChanges(data: SimpleChanges): void {
    if (this.canvas == null) {
      this.canvas = new fabric.Canvas('myCanvas');
    }

    this.layoutSetting = mergeLayouts(this.layoutSetting);

    if (this.canvasSettings) {
      this.canvas.setHeight(this.layoutSetting.height);
      this.canvas.setWidth(this.layoutSetting.width);
      this.canvas.renderAll();

      if (this.layoutSetting.backgroundImage) {
        this.setImage(cmsApiUrl(this.layoutSetting.backgroundImage.url));
      }

      if (this.canvasSettings.image) {
        fabric.Image.fromURL(proxiedUrl(this.canvasSettings.image), (myImg) => {
          const img1 = myImg.set({left: 0, top: 0}) as any;
          img1.scaleToWidth(this.canvas.width);
          this.canvas.add(img1);
          this.addTexts(img1);
        }, {crossOrigin: "*"});
      } else {
        this.addTexts(null);
      }
    }
  }

  setImage(url: string) {
    fabric.Image.fromURL(url, (myImg) => {
      const img1 = myImg.set({left: 0, top: 0}) as any;
      img1.scaleToWidth(this.canvas.width);
      this.canvas.sendToBack(img1);
    }, {crossOrigin: "*"});
  }

  addTexts(img1: any) {
    const textOffset = img1?.lineCoords?.bl?.y + 30 || 0;
    const padding = 10;
    let text = new fabric.Textbox(
      this.canvasSettings.title,
      {
        'fontFamily': 'Open Sans',
        fontSize: this.layoutSetting.fontHeadingSizePixel,
        left: padding,
        top: textOffset,
        width: this.canvas.width - 2 * padding
      }
    ) as any;
    text = text.centerH();

    this.canvas.add(text);
    this.canvas.add(new fabric.Textbox(this.canvasSettings.description, {
      fontSize: this.layoutSetting.fontTextSizePixel,
      left: padding,
      width: this.canvas.width - 2 * padding,
      top: text.lineCoords.bl.y + 30,
    }));
  }

  download() {
    let canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const link = document.createElement('a');
    link.download = 'filename.png';
    link.href = canvas.toDataURL();
    link.click();
  }
}
