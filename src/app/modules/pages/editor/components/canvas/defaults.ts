import {LayoutItemType, Preset, PresetObject} from "@app/core/model/preset";

export const DEFAULT_SETTING: Preset = {
  "id": 23,
  "width": 900,
  "height": 1600,
  "title": "MetaMapper 9:16",
  "fontFamilyHeadingCSS": "Archivo Black, sans-serif",
  "itemsJson": [
    {
      "type": "title" as LayoutItemType.TITLE,
      "offsetTop": 221,
      "offsetLeft": 123,
      "position": 0,
      "objectAngle": 0,
      "fontSize": 90,
      "fontColor": "#ffffff",
      "fontWeight": "normal",
      "fontLineHeight": "1",
      "fontLetterSpacing": "1.1"
    },
    {
      "type": "image" as LayoutItemType.IMAGE,
      "offsetTop": 10,
      "offsetLeft": 77,
      "position": 1,
      "objectAngle": 0
    },
    {
      "type": "description" as LayoutItemType.DESCRIPTION,
      "offsetTop": 62,
      "offsetLeft": 113,
      "position": 2,
      "objectAngle": 0,
      "fontSize": 29,
      "fontColor": "#ffffff",
      "fontWeight": "normal",
      "fontLineHeight": "1",
      "fontLetterSpacing": "1.1"
    }
  ],
  "backgroundImage": {
    "id": 39,
    "name": "MetaMapper",
    "alternativeText": "",
    "caption": "",
    "width": 900,
    "height": 1600,
    "formats": {
      "thumbnail": {
        "hash": "thumbnail_Meta_Mapper_c2604b32f5",
        "ext": ".png",
        "mime": "image/png",
        "width": 88,
        "height": 156,
        "size": 1.84,
        "path": null,
        "url": "/uploads/thumbnail_Meta_Mapper_c2604b32f5.png"
      },
      "large": {
        "hash": "large_Meta_Mapper_c2604b32f5",
        "ext": ".png",
        "mime": "image/png",
        "width": 563,
        "height": 1000,
        "size": 19.19,
        "path": null,
        "url": "/uploads/large_Meta_Mapper_c2604b32f5.png"
      },
      "medium": {
        "hash": "medium_Meta_Mapper_c2604b32f5",
        "ext": ".png",
        "mime": "image/png",
        "width": 422,
        "height": 750,
        "size": 13.62,
        "path": null,
        "url": "/uploads/medium_Meta_Mapper_c2604b32f5.png"
      },
      "small": {
        "hash": "small_Meta_Mapper_c2604b32f5",
        "ext": ".png",
        "mime": "image/png",
        "width": 281,
        "height": 500,
        "size": 8.34,
        "path": null,
        "url": "/uploads/small_Meta_Mapper_c2604b32f5.png"
      }
    },
    "hash": "Meta_Mapper_c2604b32f5",
    "ext": ".png",
    "mime": "image/png",
    "size": 16.12,
    "url": "/uploads/Meta_Mapper_c2604b32f5.png",
    "previewUrl": null,
    "provider": "local",
    "provider_metadata": null,
    "created_at": new Date(),
    "updated_at": new Date()
  },
};

export const DEFAULT_ITEMS: PresetObject[] = [
  {
    "offsetTop": 10,
    "position": 1,
    "fontLineHeight": "1",
    "fontLetterSpacing": "1.1",
    "fontSize": 20,
    "type": LayoutItemType.TITLE,
    "offsetLeft": 40,
  },
  {
    "offsetTop": 10,
    "position": 2,
    "fontLineHeight": "1",
    "fontLetterSpacing": "1.1",
    "fontSize": 15,
    "type": LayoutItemType.DESCRIPTION,
    "offsetLeft": 80,
  },
  {
    "offsetTop": 10,
    "position": 3,
    "fontLineHeight": "1",
    "fontLetterSpacing": "1.1",
    "fontSize": 0,
    "type": LayoutItemType.IMAGE,
    "offsetLeft": 50,
  }
];

export function mergeLayouts(layout: Preset, defaultLayout = DEFAULT_SETTING) {
  return {
    ...defaultLayout,
    ...layout,
  };
}

