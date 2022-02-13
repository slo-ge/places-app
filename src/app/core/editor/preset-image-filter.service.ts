import {fabric} from "fabric";
import {Image} from "fabric/fabric-impl";

export enum ImageFilterType {
  PIXELATE = 'pixalate',
  GREY = 'grey',
  NOISE = 'noise',
  BLACK_WHITE = 'bw',
  BROWNIE = 'brownie',
  VINTAGE = 'vintage',
  KODACHROME = 'kodachrome',
  TECHNICOLOR = 'technicolor',
  POLAROID = 'polaroid',
  SEPIA = 'sepia',
  INVERT = 'invert',
}

export interface CustomImageFilter {
  defaultOptions: any;
  type: ImageFilterType;

  apply(image: Image, options: any): Image;
}


class PixelateFilter implements CustomImageFilter {
  type = ImageFilterType.PIXELATE;
  defaultOptions = {
    blocksize: 16
  };

  apply(image: Image, options: any): Image {
    const filter = new fabric.Image.filters.Pixelate(options || this.defaultOptions);
    image.filters!.push(filter);
    return image;
  }
}


class GreyScaleFilter implements CustomImageFilter {
  defaultOptions: any = {};
  type = ImageFilterType.GREY;

  apply(image: Image, options: any): Image {
    const filter = new fabric.Image.filters.Grayscale(options || this.defaultOptions);
    image.filters!.push(filter);
    return image;
  }
}

class NoiseFilter implements CustomImageFilter {
  type = ImageFilterType.NOISE;

  defaultOptions: any = {
    noise: 200
  };

  apply(image: Image, options: any): Image {
    const filter = new fabric.Image.filters.Noise(options || this.defaultOptions);
    image.filters!.push(filter);
    return image;
  }
}

class BlackWhiteFilter implements CustomImageFilter {
  type = ImageFilterType.BLACK_WHITE;

  defaultOptions: any = {
    noise: 200
  };

  apply(image: Image, options: any): Image {
    // @ts-ignore
    const filter = new fabric.Image.filters.BlackWhite();
    image.filters!.push(filter);
    return image;
  }
}

class SepiaFilter implements CustomImageFilter {
  type = ImageFilterType.SEPIA;

  defaultOptions: any = {};

  apply(image: Image, options: any): Image {
    const filter = new fabric.Image.filters.Sepia(options);
    image.filters!.push(filter);
    return image;
  }
}

class KodaChromeFilter implements CustomImageFilter {
  type = ImageFilterType.KODACHROME;

  defaultOptions: any = {};

  apply(image: Image, options: any): Image {
    // @ts-ignore
    const filter = new fabric.Image.filters.Kodachrome(options);
    image.filters!.push(filter);
    return image;
  }
}


class PolaroidFilter implements CustomImageFilter {
  type = ImageFilterType.POLAROID;

  defaultOptions: any = {};

  apply(image: Image, options: any): Image {
    // @ts-ignore
    const filter = new fabric.Image.filters.Polaroid(options);
    image.filters!.push(filter);
    return image;
  }
}

class TechnicolorFilter implements CustomImageFilter {
  type = ImageFilterType.TECHNICOLOR;

  defaultOptions: any = {};

  apply(image: Image, options: any): Image {
    // @ts-ignore
    const filter = new fabric.Image.filters.Technicolor(options);
    image.filters!.push(filter);
    return image;
  }
}

class VintageFilter implements CustomImageFilter {
  type = ImageFilterType.VINTAGE;

  defaultOptions: any = {};

  apply(image: Image, options: any): Image {
    // @ts-ignore
    const filter = new fabric.Image.filters.Vintage(options);
    image.filters!.push(filter);
    return image;
  }
}

class BrownieFilter implements CustomImageFilter {
  type = ImageFilterType.BROWNIE;

  defaultOptions: any = {};

  apply(image: Image, options: any): Image {
    // @ts-ignore
    const filter = new fabric.Image.filters.Brownie(options);
    image.filters!.push(filter);
    return image;
  }
}

class InvertFilter implements CustomImageFilter {
  type = ImageFilterType.INVERT;

  defaultOptions: any = {};

  apply(image: Image, options: any): Image {
    // @ts-ignore
    const filter = new fabric.Image.filters.Invert(options);
    image.filters!.push(filter);
    return image;
  }
}

export const defaultFilters: CustomImageFilter[] = [
  new PixelateFilter(),
  new GreyScaleFilter(),
  new NoiseFilter(),
  new BlackWhiteFilter(),
  new SepiaFilter(),
  new KodaChromeFilter(),
  new PolaroidFilter(),
  new TechnicolorFilter(),
  new VintageFilter(),
  new BrownieFilter(),
  new InvertFilter()
];


export class PresetImageFilterService {
  public static apply(image: Image, filters: ImageFilterType[]): Image {
    filters.forEach(filter => {
      const f2 = defaultFilters.find(f => f.type === filter);
      if (f2) {
        f2.apply(image, f2.defaultOptions);
      }
    });

    image.applyFilters();
    return image;
  }
}
