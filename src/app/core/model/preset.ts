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

export interface GlobalFont {
  url: string;
}

export interface Preset {
  id: number;
  width: number;
  height: number;
  title?: string;
  created_at?: Date;
  updated_at?: Date;
  backgroundImage: BackgroundImage;

  fontFileWoff?: GlobalFont;
  fontFamilyHeadingCSS?: string;

  itemsJson?: PresetObject[];
}

export interface PresetObject {
  id?: number,
  fontSize?: number,
  fontLineHeight?: string | number,
  fontLetterSpacing?: string | number,
  fontWeight?: string | number;
  fontColor?: string;
  fontBackgroundPadding?: null | number;
  fontBackgroundColor?: null | string;
  fontUnderline?: boolean;
  offsetTop: number,
  offsetLeft: number,
  offsetRight?: number,
  offsetBottom?: number,
  type: LayoutItemType,
  title?: string,
  position: number;
  objectAngle?: number;
  zIndex?: number;
  objectPosition?: ObjectPosition;
  font?: Font;
}

export interface Font {
  importPath: string;
  fontFamily: string;
  fontName: string;
}

export enum ObjectPosition {
  STATIC = 'static', RELATIVE = 'relative', ABSOLUTE = 'absolute'
}

export enum LayoutItemType {
  TITLE = 'title',
  DESCRIPTION = 'description',
  IMAGE = 'image',
  ICON = 'icon'
}

