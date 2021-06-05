import {fabric} from "fabric";
import {Image} from "fabric/fabric-impl";

export enum ImageFilterType {
  PIXELATE = 'pixalate',
  GREY = 'grey'
}

interface ImageFilter {
  type: ImageFilterType;
  options?: any;
}


interface CustomImageFilter {
  defaultOptions: any;

  apply(image: Image, options: any): Image;
}


class PixelateFilter implements CustomImageFilter {
  defaultOptions = {
    blocksize: 8
  };

  apply(image: Image, options: any): Image {
    const filter = new fabric.Image.filters.Pixelate(options || this.defaultOptions);
    image.filters!.push(filter);
    return image;
  }
}


class GreyScaleFilter implements CustomImageFilter {
  defaultOptions: any = {};

  apply(image: Image, options: any): Image {
    const filter = new fabric.Image.filters.Grayscale(options || this.defaultOptions);
    image.filters!.push(filter);
    return image;
  }
}


const _defaultFilters = new Map<ImageFilterType, CustomImageFilter>(
  [
    [ImageFilterType.PIXELATE, new PixelateFilter()],
    [ImageFilterType.GREY, new GreyScaleFilter()]
  ]
);


export class PresetImageFilterService {
  public static apply(image: Image, filters: ImageFilter[]): Image {
    filters.forEach(filter => _defaultFilters.get(filter.type)?.apply(image, filter.options));
    image.applyFilters();
    return image;
  }
}
