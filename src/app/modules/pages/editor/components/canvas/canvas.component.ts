import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {SimplePreviewCanvasSetting} from "@app/modules/pages/editor/models";
import {fabric} from "fabric";


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnChanges {
  @Input()
  canvasSettings: SimplePreviewCanvasSetting = {} as any;
  canvas: any;

  constructor() {
  }

  ngOnChanges(data: SimpleChanges): void {
    if (data.canvasSettings && this.canvasSettings) {

      this.canvas = new fabric.Canvas('myCanvas');
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

  addTexts(img1: any) {
    const textOffset = img1?.lineCoords?.bl?.y + 30 || 0;
    const text = new fabric.Textbox(
      this.canvasSettings.title,
      {fontSize: 40, top: textOffset, width: this.canvas.width}
    ) as any;

    this.canvas.add(text);
    this.canvas.add(new fabric.Textbox(this.canvasSettings.description, {
      fontSize: 18,
      width: this.canvas.width,
      top: text.lineCoords.bl.y + 30
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
