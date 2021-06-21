import {fabric} from "fabric";
import {
  Font,
  LayoutItemType,
  ObjectPosition,
  PresetObject,
  PresetObjectStaticImage,
  PresetObjectStaticText
} from "@app/core/model/preset";
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
  presetStaticImageUrl?: string;
}

export type  CustomObject = fabric.Object & CustomFabricObjectFields;
export type  CustomTextBox = fabric.Textbox & CustomFabricObjectFields;
export type  CustomImageBox = fabric.Image & CustomFabricObjectFields;


/**
 * Maps the new canvas object to the export latest preset object format
 *
 * @param fabricObject, the fabricObject which should be saved
 * @param position, position in layout, always calculated from previous object,
 * or if it is position absolute the position will always the distance to top of canvas
 * @param canvas, current canvas
 */
function fabricObjectToPresetObject(fabricObject: CustomTextBox | CustomImageBox, position: number, canvas: Canvas): PresetObject {
  let tmp: PresetObject = {
    type: fabricObject.presetType!, // already filtered
    // TODO: calculate offset correct, it is not possible to use the current offset of the canvas because it is not relative to the size of the text
    offsetTop: Math.round(fabricObject.presetOffsetTop || 0),
    offsetLeft: Math.round(fabricObject.left || 0),
    position: position
  };

  if (fabricObject.angle != 360) {
    tmp.objectAngle = fabricObject.angle;
  }

  tmp.objectPosition = fabricObject.presetObjectPosition;
  // Setting the correct x position, the y position is already set in the previous method
  if (isPositionXFixed(tmp)) {
    tmp.offsetRight = canvas.width! - fabricObject.getScaledWidth() - fabricObject.left!;
  }


  const zIndex = canvas.getObjects().indexOf(fabricObject);
  if (zIndex > 0) {
    tmp.zIndex = zIndex;
  }

  if (isText(tmp)) {
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

    if (fabricObject.backgroundColor) {
      tmp.fontBackgroundColor = fabricObject.backgroundColor;
    } else {
      tmp.fontBackgroundColor = null;
    }

    if (fabricObject.padding) {
      tmp.fontBackgroundPadding = fabricObject.padding;
    }

    if (fabricObject.underline) {
      tmp.fontUnderline = fabricObject.underline;
    } else {
      tmp.fontUnderline = false;
    }
  }

  if (tmp.type === LayoutItemType.STATIC_TEXT) {
    (tmp as PresetObjectStaticText).text = (fabricObject as CustomTextBox).text!;
  }

  if (tmp.type === LayoutItemType.STATIC_IMAGE) {
    (tmp as PresetObjectStaticImage).image = {url: fabricObject.presetStaticImageUrl!};
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
export function getPresetItem(canvas: Canvas): PresetObject[] {
  const items = canvas.getObjects()
    .filter(object => (object as CustomObject).presetType != null);

  return prepareItems(items)
    .map((item, index) => fabricObjectToPresetObject(item as any, index, canvas));
}

/**
 * Sets attributes which are related to all objects in canvas.
 *
 * @param items
 */
export function prepareItems(items: CustomObject[]) {
  let posLastObjectY = 0;
  let item: CustomObject;
  for (item of items.sort(sortCanvasObject)) {
    // Returns the correct y position,
    //if position = absolute_Y we do not calculate the spacing to the previous object.
    // We just do use the absolute url. So it ignores the position of the last element
    item.presetOffsetTop = isPositionYFixed(item) ? item.top : item.top! - posLastObjectY;

    // calculate last position of object
    posLastObjectY = getYPos(item);
  }

  return items;
}

/**
 * This methods returns the correct value to a given metaProperty type,
 * or if it is an static field it returns the corresponding field data
 *
 * It returns also a default value, if one of the meta tags is not found
 *
 * @param metaProperties
 * @param presetObject
 */
export function getMetaFieldOrStaticField(metaProperties: MetaMapperData, presetObject: PresetObject) {
  switch (presetObject.type) {
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
      return metaProperties.image || 'https://via.placeholder.com/400x200/000000/FFFFFF/?text=ogImage%20Not%20Found';
    }
    case LayoutItemType.STATIC_TEXT: {
      return (presetObject as PresetObjectStaticText).text || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
    }
    case LayoutItemType.STATIC_IMAGE: {
      return (presetObject as PresetObjectStaticImage).image.url!
        || 'https://via.placeholder.com/400x200/000000/FFFFFF/?text=StaticImage%20Not%20Found';
    }
  }

  throw Error(`Layout Type ${presetObject.type} can not be mapped to meta object`);
}

/**
 * Is presetObject a text object
 */
export function isImage(item: PresetObject | LayoutItemType): Boolean {
  const presetType = (item as PresetObject).type ? (item as PresetObject).type : item;
  return presetType === LayoutItemType.IMAGE
    || presetType === LayoutItemType.ICON
    || presetType === LayoutItemType.STATIC_IMAGE;
}

/**
 * Is presetObject a image object
 */
export function isText(item: PresetObject | LayoutItemType): Boolean {
  const presetType = (item as PresetObject).type ? (item as PresetObject).type : item;
  return presetType === LayoutItemType.TITLE
    || presetType === LayoutItemType.DESCRIPTION
    || presetType === LayoutItemType.STATIC_TEXT;
}

/**
 * Is the X-Position fixed
 */
export function isPositionXFixed(item: PresetObject | CustomObject) {
  const positionType = (item as PresetObject).objectPosition
    ? (item as PresetObject).objectPosition
    : (item as CustomObject).presetObjectPosition;

  return positionType === ObjectPosition.ABSOLUTE_DEPRECATED
    || positionType === ObjectPosition.ABSOLUTE_X
    || positionType === ObjectPosition.ABSOLUTE_XY;
}

/**
 * Is the Y-Position fixed
 */
export function isPositionYFixed(item: PresetObject | CustomObject) {
  const positionType = (item as PresetObject).objectPosition
    ? (item as PresetObject).objectPosition
    : (item as CustomObject).presetObjectPosition;

  return positionType === ObjectPosition.ABSOLUTE_Y
    || positionType === ObjectPosition.ABSOLUTE_XY;
}

/**
 * Returns the current text of the fabric Object by there layout type,
 *
 * @param canvas, current canvas
 * @param type, only text types
 */
export function getCurrentTextOfFabricObject(canvas: Canvas, type: LayoutItemType.TITLE | LayoutItemType.DESCRIPTION): string | undefined {
  const items = canvas.getObjects().filter(object => (object as CustomObject).presetType === type);

  return (items?.[0] as CustomTextBox)?.text;
}
