import {LayoutItemType} from "@app/core/model/preset";

export const FALLBACKS: Record<LayoutItemType, string> = {
  [LayoutItemType.TITLE]: 'Title missing',
  [LayoutItemType.DESCRIPTION]: 'Description does not exists in current meta data.',
  [LayoutItemType.ICON]: 'https://via.placeholder.com/150/000000/FFFFFF/?text=Icon%20NotFound',
  [LayoutItemType.IMAGE]: '/assets/images/meta-mapper-placeholder.jpg',
  [LayoutItemType.STATIC_TEXT]: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  [LayoutItemType.STATIC_IMAGE]: '/assets/images/meta-mapper-placeholder.jpg',
  [LayoutItemType.PRICE]: '99 €'
}
