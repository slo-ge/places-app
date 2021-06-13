import {WpEmbed} from "./embed";

export interface WpObject {
    id: number;
    date: string;
    date_gmt: string;
    guid: Rendered;
    modified: string;
    modified_gmt: string;
    slug: string;
    status: string;
    type: string;
    link: string;
    title: Rendered;
    content: ContentRendered;
    excerpt: ContentRendered;
    author: number;
    featured_media: number;
    comment_status: string;
    ping_status: string;
    template: string;
    meta?: (null)[] | null;
    _embedded: WpEmbed;
    tags?: number[];
}

export interface Rendered {
    rendered: string;
}

export interface ContentRendered {
    rendered: string;
    protected: boolean;
}

export interface ACF {
    place: Place;
    description: Description[];
    mainCategory: Category;
}

export interface Category {
    term_id: number;
    name: string;
    slug: string;
    count: number;
    description: string;

}

interface Description {
    language: string;
    text: string;
}

interface Place {
    address: string;
    lat: number;
    lng: number;
}

export interface ACFLocation extends WpObject {
    acf: ACF
}

export interface GeoPosition {
    lat: number;
    lng: number
}

export enum ContentType {
    PAGE = 'pages',
    POST = 'posts',
    LOCATION = 'locations'
}

export interface RelatedPlace {
    place: {
        ID: number
    }
}

export interface Post extends WpObject {
    acf: {
        relatedPlaces: RelatedPlace[]
    }
}

export interface Page extends WpObject {
}
