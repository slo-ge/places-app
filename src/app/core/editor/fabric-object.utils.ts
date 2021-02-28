import {fabric} from "fabric";
import {Font, LayoutItemType, ObjectPosition, PresetObject} from "@app/core/model/preset";
import {Canvas, Object} from "fabric/fabric-impl";
import {MetaMapperData} from "@app/modules/pages/editor/models";

/**
 * Extra information which can a fabric object hold
 */
interface CustomFabricObjectFields {
  presetType?: LayoutItemType;
  presetOffsetTop?: number;
  presetObjectPosition?: ObjectPosition;
  presetFont?: Font;
}

export type  CustomObject = fabric.Object & CustomFabricObjectFields;
export type  CustomTextBox = fabric.Textbox & CustomFabricObjectFields;
export type  CustomImageBox = fabric.Image & CustomFabricObjectFields;


/**
 * Maps the new canvas object to the export latest preset object format
 *
 * @param fabricObject, the fabricObject which should be saved
 * @param position, position in layout, always calculated from previous object
 * @param canvas, current canvas
 */
function fabricObjectToPresetObject(fabricObject: CustomTextBox | CustomImageBox, position: number, canvas: Canvas): PresetObject {
  let tmp: PresetObject = {
    type: fabricObject.presetType || LayoutItemType.TITLE,
    // TODO: calculate offset correct, it is not possible to use the current offset of the canvas because it is not relative to the size of the text
    offsetTop: Math.round(fabricObject.presetOffsetTop || 0),
    offsetLeft: Math.round(fabricObject.left || 0),
    position: position
  };

  if (fabricObject.angle != 360) {
    tmp.objectAngle = fabricObject.angle;
  }

  if (fabricObject.presetObjectPosition === ObjectPosition.ABSOLUTE) {
    tmp.objectPosition = fabricObject.presetObjectPosition;
    // @ts-ignore
    tmp.offsetRight = canvas.width - fabricObject.getScaledWidth() - fabricObject.left;
  }

  const zIndex = canvas.getObjects().indexOf(fabricObject);
  if (zIndex > 0) {
    tmp.zIndex = zIndex;
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

    if (fabricObject.presetFont) {
      tmp.font = fabricObject.presetFont;
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


/**
 * position sort function
 *
 * @param a
 * @param b
 */
export function sortCanvasObject(a: Object, b: Object) {
  return getYPos(a) < getYPos(b) ? -1 : 1;
}

/**
 * returns the current items and
 */
export function getPresetItem(canvas: Canvas) {
  const items = canvas.getObjects().filter(object => (object as CustomObject).presetType != null);
  let posLastObjectY = 0;
  for (let item of items.sort(sortCanvasObject)) {
    (item as CustomObject).presetOffsetTop = (item as any).top - posLastObjectY;
    posLastObjectY = getYPos(item);
  }

  return items.map((item, index) => fabricObjectToPresetObject(item as any, index, canvas));
}


/**
 * This methods returns the correct value to a given metaProperty type
 *
 * It returns also a default value, if one of the meta tags is not found
 *
 * @param metaProperties
 * @param type
 */
export function getMetaField(metaProperties: MetaMapperData, type: LayoutItemType) {
  switch (type) {
    case LayoutItemType.TITLE: {
      return metaProperties.title || 'empty title';
    }
    case LayoutItemType.DESCRIPTION: {
      return metaProperties.description || 'empty description';
    }
    case LayoutItemType.ICON: {
      return metaProperties.iconUrl || 'https://via.placeholder.com/150/000000/FFFFFF/?text=Icon NotFound';
    }
    case LayoutItemType.IMAGE: {
      return metaProperties.image || 'https://via.placeholder.com/150/000000/FFFFFF/?text=ogImage Not Found';
    }
  }
}

export function isImage(item: PresetObject) {
  return item.type === LayoutItemType.IMAGE || item.type === LayoutItemType.ICON;
}

export function isText(item: PresetObject) {
  return item.type === LayoutItemType.TITLE || item.type === LayoutItemType.DESCRIPTION;
}
