import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {SimplePreviewCanvasSetting} from "@app/modules/pages/editor/models";
import {fabric} from "fabric";
import {LayoutSetting} from "@app/core/model/layout-setting";
import {LAYOUT_CONFIG_BASE_URL} from "@app/core/services/layout-setting.service";

const DEFAULT_SETTING: LayoutSetting = {
  height: 1600,
  width: 900
};

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

    const setting = {
      ...DEFAULT_SETTING,
      ...this.layoutSetting
    };

    if (this.canvasSettings) {
      this.canvas.setHeight(setting.height);
      this.canvas.setWidth(setting.width);
      this.canvas.renderAll();

      if (setting.backgroundImage) {
        this.setImage(`${LAYOUT_CONFIG_BASE_URL}${setting.backgroundImage.url}`);
      }

      if (this.canvasSettings.image) {
        fabric.Image.fromURL(this.canvasSettings.image, (myImg) => {
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
    });
  }

  addTexts(img1: any) {
    const textOffset = img1?.lineCoords?.bl?.y + 30 || 0;
    const padding = 10;
    let text = new fabric.Textbox(
      this.canvasSettings.title,
      {
        'fontFamily': 'Open Sans',
        fontSize: 40,
        left: padding,
        top: textOffset,
        width: this.canvas.width - 2 * padding
      }
    ) as any;
    text = text.centerH();

    this.canvas.add(text);
    this.canvas.add(new fabric.Textbox(this.canvasSettings.description, {
      fontSize: 18,
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
