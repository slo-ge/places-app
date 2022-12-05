import {Component, Input} from '@angular/core';
import {Canvas} from "fabric/fabric-impl";
import {fabric} from "fabric";
import {CustomObject} from "@app/core/editor/fabric-object.utils";
import {LayoutItemType} from "@app/core/model/preset";

@Component({
  selector: 'app-add-shape',
  templateUrl: './add-shape.component.html',
  styleUrls: ['./add-shape.component.scss']
})
export class AddShapeComponent {
  @Input()
  canvas!: Canvas;

  constructor() {
  }

  addCircle() {
    const circle: CustomObject = new fabric.Circle({
      radius: 200,
      fill: 'red',
    });
    circle.presetType = LayoutItemType.CIRCLE;
    this.canvas.add(circle);
  }

  addRect() {
    const rect: CustomObject = new fabric.Rect({
      left: 100,
      top: 100,
      fill: 'red',
      width: 200,
      height: 200
    });
    rect.presetType = LayoutItemType.RECT;
    this.canvas.add(rect);
  }
}


