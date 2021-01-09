export interface ImageSize {
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path?: any;
  url: string;
}

export interface Formats {
  thumbnail: ImageSize;
  large: ImageSize;
  medium: ImageSize;
  small: ImageSize;
}

export interface BackgroundImage {
  id: number;
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: Formats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: any;
  provider: string;
  provider_metadata?: any;
  created_at: Date;
  updated_at: Date;
}

export interface Font {
  url: string;
}

export interface ExportLatestPreset {
  id?: number;
  width: number;
  height: number;
  title?: string;
  created_at?: Date;
  updated_at?: Date;
  backgroundImage?: BackgroundImage;

  fontFileWoff?: Font;
  fontFamilyHeadingCSS?: string;

  items?: ExportLatestPresetObject[]; // new API
}

export interface ExportLatestPresetObject {
  id?: number,
  fontSize?: number,
  fontLineHeight?: string,
  fontLetterSpacing?: string,
  offsetTop: number,
  offsetLeft: number,
  type: LayoutItemType,
  title?: string,
  position?: number;
  fontWeight?: null | 'bold';
}

export enum LayoutItemType {
  TITLE = 'title',
  DESCRIPTION = 'description',
  IMAGE = 'image'
}

