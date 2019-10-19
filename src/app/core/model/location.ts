import {WpEmbed} from "./embed";

export interface Location {
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

export interface ACFLocation extends Location {
    acf: ACF
}