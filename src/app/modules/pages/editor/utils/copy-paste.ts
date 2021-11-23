import {fabric} from "fabric";
import {CustomObject} from "@app/core/editor/fabric-object.utils";

/**
 * TODO:
 *  - todo: typing
 *  - todo: clipboard state should not be here in this class
 *  - todo: get
 */
let clipboard: any | null = null;



export function copyPasteKeyPress($event: KeyboardEvent,
                                  activeObject: any,
                                  canvas: fabric.Canvas) {
  if(($event.ctrlKey || $event.metaKey) && $event.key == 'c') {
    copy(activeObject);
  }
  if(($event.ctrlKey || $event.metaKey) && $event.key == 'v') {
    paste(canvas);
  }
}

export function copy(activeObject: any): void {
  activeObject?.clone((obj: CustomObject) => {
    clipboard = obj;
  });
}

export function paste(canvas: fabric.Canvas, existingClone?: fabric.Object): void {
  if (clipboard === null && existingClone === null) {
    return;
  }

  const cloneableObject = existingClone || clipboard;


  cloneableObject.clone((clonedObj: any) => {
    if (clonedObj === undefined || !cloneableObject) {
      return;
    }

    canvas.discardActiveObject();
    clonedObj.set({
      left: clonedObj.left + 10,
      top: clonedObj.top + 10,
      evented: true,
    });

    if (clonedObj.type === 'activeSelection') {
      clonedObj.canvas = canvas;
      clonedObj.forEachObject((obj: fabric.Object) => {
        canvas.add(obj);
      });
      clonedObj.setCoords();
    } else {
      canvas.add(clonedObj);
    }

    cloneableObject.top += 10;
    cloneableObject.left += 10;

    canvas.setActiveObject(clonedObj);
    canvas.requestRenderAll();
  });
}

export function isSomethingSelected(): boolean {
  return !!clipboard;
}
