import {fabric} from "fabric";
import {PresetObject} from "@app/core/model/preset";

/**
 * An interface for the current settings
 * which the canvas object hold
 */
export interface ObjectPreset {
  object: fabric.Image | fabric.Textbox;
  item: PresetObject;
}


/**
 * maps the new canvas object to the export latest preset object format
 *
 * @param item
 */
export function fabricObjectToPresetObject(item: ObjectPreset): PresetObject {
  const fabricObject = item.object as fabric.Textbox;
  const tmp = {
    ...item.item,
    // TODO: calculate offset correct, it is not possible to use the current offset of the canvas because it is not relative to the size of the text
    offsetTop: Math.round(fabricObject.top || 0),
    offsetLeft: Math.round(fabricObject.left || 0),
    position: item.item.position, // TODO, generate the new positions in layout be there y position
    fontSize: Math.round(fabricObject.fontSize || 0),
    type: item.item.type
  };

  if (fabricObject.fontWeight) {
    //tmp.fontWeight = fabricObject.fontWeight;
  }

  if (fabricObject.lineHeight) {
    //tmp.fontLineHeight =  fabricObject.lineHeight;
  }

  if (fabricObject.charSpacing) {
    //tmp.fontLetterSpacing =  fabricObject.charSpacing;
  }

  return tmp;
}

/**
 * get the baseline y coord of fabric object
 * @param obj
 */
export function getYPos(obj: any): number {
  return obj?.lineCoords?.bl?.y || 0
}

