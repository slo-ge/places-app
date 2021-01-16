import {fabric} from "fabric";
import {LayoutItemType, PresetObject} from "@app/core/model/preset";
import {Canvas, Object} from "fabric/fabric-impl";

/**
 * TODO: please make extend the fabric.Textbox stuff
 * with the following keys (presetType / presetOffsetTop) to avoid this
 * hacky `any`-casting;
 */
export const PRESET_TYPE_KEY = 'presetType';
const PRESET_OFFSET_TOP_KEY = 'presetOffsetTop';

interface CustomFabricObjectFields {
  presetType?: LayoutItemType;
  presetOffsetTop?: number;
}

type  CustomTextBox = fabric.Textbox & CustomFabricObjectFields;
type  CustomImageBox = fabric.Image & CustomFabricObjectFields;

/**
 * maps the new canvas object to the export latest preset object format
 *
 * @param fabricObject
 * @param position
 */
function fabricObjectToPresetObject(fabricObject: CustomTextBox | CustomImageBox, position: number): PresetObject {
  console.log(position);
  let tmp: PresetObject = {
    type: fabricObject.presetType || LayoutItemType.TITLE,
    // TODO: calculate offset correct, it is not possible to use the current offset of the canvas because it is not relative to the size of the text
    offsetTop: Math.round(fabricObject[PRESET_OFFSET_TOP_KEY] || 0),
    offsetLeft: Math.round(fabricObject.left || 0),
    position: position
  };

  if (fabricObject.angle != 360) {
    tmp.objectAngle = fabricObject.angle;
  }

  if (fabricObject.presetType === LayoutItemType.TITLE
    || fabricObject.presetType === LayoutItemType.DESCRIPTION) {

    fabricObject = fabricObject as CustomTextBox;

    if (fabricObject.fontSize) {
      tmp.fontSize = Math.round(fabricObject.fontSize || 0);
    }
    if (fabricObject.fill) {
      tmp.fontColor = fabricObject.fill as string;
    }
    if (fabricObject.fontWeight) {
      tmp.fontWeight = fabricObject.fontWeight;
    }
    if (fabricObject.lineHeight) {
      tmp.fontLineHeight = fabricObject.lineHeight;
    }
    if (fabricObject.charSpacing) {
      tmp.fontLetterSpacing = fabricObject.charSpacing;
    }
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


function sortCanvasObject(a: Object, b: Object) {
  return getYPos(a) < getYPos(b) ? -1 : 1;
}

/**
 * returns the current items and
 */
export function getPresetItem(canvas: Canvas) {
  const items = canvas.getObjects().filter(object => (object as any)[PRESET_TYPE_KEY] != null);
  let posLastObjectY = 0;
  for (let item of items.sort(sortCanvasObject)) {
    (item as any)[PRESET_OFFSET_TOP_KEY] = (item as any).top - posLastObjectY;
    posLastObjectY = getYPos(item);
  }

  return items.map((item, index) => fabricObjectToPresetObject(item as any, index));
}
