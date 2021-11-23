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
  console.log(activeObject, clipboard, canvas);
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

export function paste(canvas: fabric.Canvas): void {
  if (clipboard === null) {
    return;
  }

  clipboard.clone((clonedObj: any) => {
    if (clonedObj === undefined || !clipboard) {
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

    clipboard.top += 10;
    clipboard.left += 10;

    canvas.setActiveObject(clonedObj);
    canvas.requestRenderAll();
  });
}
