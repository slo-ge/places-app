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

export const FONTS: Font[] = [
  {
    fontFamily: "'Montserrat', sans-serif",
    importPath: 'https://fonts.googleapis.com/css2?family=Montserrat&display=swap',
    fontName: 'Montserrat'
  },
  {
    fontFamily: "'Noto Serif', serif",
    importPath: 'https://fonts.googleapis.com/css2?family=Montserrat&family=Noto+Serif&display=swap',
    fontName: 'Noto Serif'
  },
  {
    fontFamily: '"Archivo Black", sans-serif',
    importPath: 'https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap',
    fontName: 'Archivo Black'
  },
  {
    fontFamily: "'Fraunces', serif",
    importPath: 'https://fonts.googleapis.com/css2?family=Fraunces&display=swap',
    fontName: 'Fraunces'
  },
  {
    fontFamily: "'Lobster', cursive",
    importPath: 'https://fonts.googleapis.com/css2?family=Lobster&display=swap',
    fontName: 'Lobster'
  },
  {
    fontFamily: "'Abril Fatface', cursive",
    importPath: 'https://fonts.googleapis.com/css2?family=Abril+Fatface&display=swap',
    fontName: 'Abril Fatface'
  },
  {
    fontFamily: "'Rubik', sans-serif",
    importPath: 'https://fonts.googleapis.com/css2?family=Rubik&display=swap',
    fontName: 'Rubik'
  },
  {
    fontFamily: "'VT323', monospace",
    importPath: 'https://fonts.googleapis.com/css2?family=VT323&display=swap',
    fontName: 'VT323'
  },
  {
    fontFamily: "'Major Mono Display', monospace",
    importPath: 'https://fonts.googleapis.com/css2?family=Major+Mono+Display&display=swap',
    fontName: 'Major Mono Display'
  },
  {
    fontFamily: "'Press Start 2P', cursive",
    importPath: 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
    fontName: 'Press Start 2P'
  },
  {
    fontFamily: "'Monoton', cursive",
    importPath: 'https://fonts.googleapis.com/css2?family=Monoton&display=swap',
    fontName: 'Monoton'
  },
  {
    fontFamily: "'Bungee Shade', cursive",
    importPath: 'https://fonts.googleapis.com/css2?family=Bungee+Shade&display=swap',
    fontName: 'Bungee Shade'
  }

];


export enum ObjectPosition {
  STATIC = 'static', RELATIVE = 'relative', ABSOLUTE = 'absolute'
}

export enum LayoutItemType {
  TITLE = 'title',
  DESCRIPTION = 'description',
  IMAGE = 'image',
  ICON = 'icon'
}

