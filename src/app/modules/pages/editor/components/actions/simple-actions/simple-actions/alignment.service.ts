import {Injectable} from '@angular/core';
import {Canvas, Object as FabricObject} from "fabric/fabric-impl";

export enum ObjectAlignments {
  TopLeft, TopCenter, TopRight,
  CenterLeft, CenterCenter, CenterRight,
  BottomLeft, BottomCenter, BottomRight
}

export enum SimpleAlignments {
  Left = 'simpleLeft',
  Right = 'simpleRight',
  Center = 'simpleCenter'
}

export function dictToKeys(dict: any): any[] {
  const array = [];
  for (const [key, value] of Object.entries(dict)) {
    if (!Number.isNaN(Number(key))) {
      continue;
    }
    array.push(value);
  }
  return array;
}

@Injectable({
  providedIn: 'root'
})
export class AlignmentService {
  alignmentActions = {
    [ObjectAlignments.TopLeft]: () => {
      this.moveTop();
      this.moveLeft();
    },
    [ObjectAlignments.TopCenter]: () => {
      this.moveTop();
      this.moveCenterH();
    },
    [ObjectAlignments.TopRight]: () => {
      this.moveTop();
      this.moveRight();
    },
    [ObjectAlignments.CenterLeft]: () => {
      this.moveLeft();
      this.moveCenterV();
    },
    [ObjectAlignments.CenterCenter]: () => {
      this.moveCenterH();
      this.moveCenterV();
    },
    [ObjectAlignments.CenterRight]: () => {
      this.moveRight();
      this.moveCenterV();
    },
    [ObjectAlignments.BottomLeft]: () => {
      this.moveLeft();
      this.moveBottom();
    },
    [ObjectAlignments.BottomCenter]: () => {
      this.moveCenterH();
      this.moveBottom();
    },
    [ObjectAlignments.BottomRight]: () => {
      this.moveRight();
      this.moveBottom();
    },
    [SimpleAlignments.Left]: () => this.moveLeft(),
    [SimpleAlignments.Right]: () => this.moveRight(),
    [SimpleAlignments.Center]: () => this.moveCenterH(),
  };

  canvas: any | Canvas = null;
  active: any | FabricObject = null;


  constructor() {
  }


  private moveCenterV() {
    this.canvas.getActiveObject().centerV();
  }

  private moveCenterH() {
    this.canvas.getActiveObject().centerH();
  }

  private moveLeft() {
    this.active.left = 0;
    this.canvas.renderAll();
  }

  private moveRight() {
    this.active.left = this.canvas.width - (this.active.width * this.active.scaleX);
    this.canvas.renderAll();
  }

  private moveTop() {
    this.active.top = 0;
    this.canvas.renderAll();
  }

  private moveBottom() {
    this.active.top = this.canvas.height - (this.active.height * this.active.scaleY);
    this.canvas.renderAll();
  }

  move(aligner: ObjectAlignments | SimpleAlignments, canvas: Canvas, active: FabricObject) {
    console.log(aligner);
    this.canvas = canvas;
    this.active = active;
    this.alignmentActions[aligner]();
  }
}
