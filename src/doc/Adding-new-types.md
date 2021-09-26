## Adding a new type (i.e. Price)

### Add new type to meta adapter 
mapping the new field from our api to the internal data object
```` json

// meta-content.adapter.ts 
export interface MetaData {
  metaDescription: string;
  ogDescription: string;
  ogImage: string;
  ogTitle: string;
  title: string;
  iconUrl?: string;
  // the new type which will be fetched from meta.adapter.ts
  price?: {
    lowestPrice: Number | string | null;
    highestPrice: Number | string | null;
    currency: Number | string | null;
    displayPrice: string | null;
  }
}
````

### Then adding new type to the internal models 

```ts
// models.ts

export interface MetaMapperData {
  title: string;
  description: string;
  image?: string | null;
  iconUrl?: string | null;
  url: string;
  displayPrice?: string | null; // the new price field which will be displayed in any preset
}
```
### Defining the new field as an enum type 

```ts 
// in preset.ts 

export enum LayoutItemType {
  TITLE = 'title',
  DESCRIPTION = 'description',
  IMAGE = 'image',
  ICON = 'icon',
  STATIC_TEXT = 'static-text',
  STATIC_IMAGE = 'static-image',
  PRICE = 'price' // the new price type, which will also be persisted in the preset 
}
```

### Then adding it to the field extractor method 

```ts

export function getMetaFieldOrStaticField(metaProperties: MetaMapperData, presetObject: PresetObject) {
  switch (presetObject.type) {
    case LayoutItemType.TITLE: {
      return metaProperties.title || 'empty title';
    }
    ...
      // here adding the new field 
    case LayoutItemType.PRICE: {
      return metaProperties.displayPrice || '99 €';
    }
	...
  }

  throw Error(`Layout Type ${presetObject.type} can not be mapped to meta object`);
}

```

### And last part, adding the field to the Editor UI to add it to any preset 
And finally defining the field in `meta-data-actions.component.html`
```ts
// meta-data-actions.component.html
<div *ngIf="metaProperties?.displayPrice" (click)="addObject(LayoutItemType.PRICE)" trackClick="Meta Action | Add Price">
  <fa-icon [icon]="plusIcon"></fa-icon>
  Meta Price <fa-icon [icon]="moneyBillIcon"></fa-icon> 
  </div>
```

### Apendix
The new field should also be defined in other adapters, otherwise it will only work with our meta adapter, and not with the 
`static` or the `placeholder` adapter
