import {Component, Input} from '@angular/core';
import {Canvas} from "fabric/fabric-impl";
import {fabric} from "fabric";
import {CustomObject} from "@app/core/editor/fabric-object.utils";
import {LayoutItemType, ObjectPosition} from "@app/core/model/preset";
import {faCircle, faSquare} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-add-shape',
  templateUrl: './add-shape.component.html',
  styleUrls: ['./add-shape.component.scss']
})
export class AddShapeComponent {
  @Input()
  canvas!: Canvas;

  faCircle = faCircle;
  faRect = faSquare;

  constructor() {
  }

  addCircle() {
    const circle: fabric.Circle & CustomObject = new fabric.Circle({
      top: 100,
      left: 100,
      radius: 200,
      fill: '#20bfa9',
    });
    circle.presetType = LayoutItemType.CIRCLE;
    circle.presetObjectPosition = ObjectPosition.ABSOLUTE_XY;
    this.canvas.add(circle);
  }

  addRect() {
    const rect: fabric.Rect & CustomObject = new fabric.Rect({
      left: 100,
      top: 100,
      fill: '#20bfa9',
      width: 400,
      height: 400
    });
    rect.presetType = LayoutItemType.RECT;
    rect.presetObjectPosition = ObjectPosition.ABSOLUTE_XY;
    this.canvas.add(rect);
  }
}


