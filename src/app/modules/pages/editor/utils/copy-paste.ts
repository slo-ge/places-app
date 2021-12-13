import {fabric} from "fabric";
import {CustomObject, CustomTextBox} from "@app/core/editor/fabric-object.utils";

/**
 * TODO:
 *  - todo: typing
 *  - todo: clipboard state should not be here in this class
 *  - todo: get
 */

let clipboard: any | null = null;
const IS_FABRIC_OBJECT_COPY_ACTION = 'fabric-copy';


export async function copyPasteKeyPress($event: KeyboardEvent,
                                  activeObject: any,
                                  canvas: fabric.Canvas) {
  if(($event.ctrlKey || $event.metaKey) && $event.key == 'c') {
    // if we have selected some text inside the text box, we do not copy the whole object
    if (activeObject && !activeObject.isEditing) {
      await navigator.clipboard.writeText(IS_FABRIC_OBJECT_COPY_ACTION); // set that the current copy is an fabric copy
      copy(activeObject);
    }
  }
  if(($event.ctrlKey || $event.metaKey) && $event.key == 'v') {
    // only if it is a FABRIC_COPY then we should clone the active object
    const text = await navigator.clipboard.readText();
    if(text === IS_FABRIC_OBJECT_COPY_ACTION) {
      paste(canvas);
    }
  }
}

export function copy(activeObject: any): void {
  clipboard = null;
  activeObject?.clone((obj: CustomObject) => {
    clipboard = obj;
  });
}

export function paste(canvas: fabric.Canvas, existingClone?: fabric.Object): void {
  if (clipboard === null && (existingClone === null || existingClone === undefined)) {
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
