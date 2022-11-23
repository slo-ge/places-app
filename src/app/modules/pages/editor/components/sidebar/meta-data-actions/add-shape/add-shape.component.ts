import { Component, Input } from '@angular/core';
import { Canvas } from "fabric/fabric-impl";
import { fabric } from "fabric";

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
    const circle = new fabric.Circle({
      radius: 200,
      fill: 'red',
    });

    this.canvas.add(circle);
  }

  addRect() {
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: 'red',
      width: 200,
      height: 200
    });

    this.canvas.add(rect);
  }
}


