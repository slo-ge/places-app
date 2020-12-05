export enum MediaTypes {
    Image = 'image'
}

export interface WpEmbed {
    'wp:featuredmedia': WpFeatureMedia[];
}

interface WpFeatureMedia {
    id: number;
    date: string;
    slug: string;
    type: string;
    link: string;
    title: Title;
    author: number;
    caption: Title;
    alt_text: string;
    media_type: string;
    mime_type: string;
    media_details: MediaDetails;
    source_url: string;
}

interface MediaDetails {
    width: number;
    height: number;
    file: string;
    sizes: Sizes;
    image_meta: ImageMeta;
}

interface ImageMeta {
    aperture: string;
    credit: string;
    camera: string;
    caption: string;
    created_timestamp: string;
    copyright: string;
    focal_length: string;
    iso: string;
    shutter_speed: string;
    title: string;
    orientation: string;
    keywords: any[];
}

interface Sizes {
    thumbnail: Thumbnail;
    medium: Thumbnail;
    medium_large: Thumbnail;
    full: Thumbnail;
}

interface Thumbnail {
    file: string;
    width: number;
    height: number;
    mime_type: string;
    source_url: string;
}

interface Title {
    rendered: string;
}
