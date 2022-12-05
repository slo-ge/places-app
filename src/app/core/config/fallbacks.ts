import {MetaTypes} from "@app/core/model/preset";

export const FALLBACKS: Record<MetaTypes, string> = {
  [MetaTypes.TITLE]: 'Title missing',
  [MetaTypes.DESCRIPTION]: 'Description does not exists in current meta data.',
  [MetaTypes.ICON]: 'https://via.placeholder.com/150/000000/FFFFFF/?text=Icon%20NotFound',
  [MetaTypes.IMAGE]: '/assets/images/meta-mapper-placeholder.jpg',
  [MetaTypes.STATIC_TEXT]: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  [MetaTypes.STATIC_IMAGE]: '/assets/images/meta-mapper-placeholder.jpg',
  [MetaTypes.PRICE]: '99 €'
}
