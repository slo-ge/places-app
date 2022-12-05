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

  itemsJson?: Array<PresetObject | PresetObjectStaticText | PresetObjectStaticImage>;

  preview?: BackgroundImage;
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
  // Vertical position
  position: number;
  objectAngle?: number;
  zIndex?: number;
  objectPosition?: ObjectPosition;
  font?: Font;
  textAlignment?: any;
  clipPath?: ClipPath;
  stroke?: {stroke: string, strokeWidth: number, strokeUniform: boolean};
  shadow?: {
    color?: string | undefined;
    blur?: number | undefined;
    offsetX?: number | undefined;
    offsetY?: number | undefined;
    affectStroke?: boolean | undefined;
    includeDefaultValues?: boolean | undefined;
    nonScaling?: boolean | undefined;
  }
}

export interface ClipPath {
  type: 'circle' | 'rect';
  radius?: number;
  height: number;
  width: number;
  scaleX: number;
  scaleY: number;
  left: number;
  top: number;
}

export interface PresetObjectStaticText extends PresetObject {
  type: LayoutItemType.STATIC_TEXT;
  text: string;
}

export interface PresetObjectStaticImage extends PresetObject {
  image: Partial<BackgroundImage>;
}

export interface PresetObjectCircle extends PresetObject {
  radius: number;
  fill: string;
}

export interface PresetObjectRect extends PresetObject {
  fill: string;
}


export interface Font {
  importPath: string;
  fontFamily: string;
  fontName: string;
}

export enum ObjectPosition {
  RELATIVE = 'relative',
  ABSOLUTE_DEPRECATED = 'absolute', // TODO: remove in near future
  ABSOLUTE_X = 'absoluteX',
  ABSOLUTE_Y = 'absoluteY',
  ABSOLUTE_XY = 'absoluteXY'
}

export enum LayoutItemType {
  TITLE = 'title',
  DESCRIPTION = 'description',
  IMAGE = 'image',
  ICON = 'icon',
  STATIC_TEXT = 'static-text',
  STATIC_IMAGE = 'static-image',
  PRICE = 'price',
  RECT = 'rect',
  CIRCLE = 'circle'
}

// Overlapping with LayoutItemType
export enum MetaTypes {
  TITLE = 'title',
  DESCRIPTION = 'description',
  IMAGE = 'image',
  ICON = 'icon',
  STATIC_TEXT = 'static-text',
  STATIC_IMAGE = 'static-image',
  PRICE = 'price',
}
