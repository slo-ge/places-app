import {WpEmbed} from "./embed";
import {ACFTag} from "@places/core/model/tags";

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

export interface RelatedWpObject {
    ID: number
    post_author: string
    post_date: string
    post_date_gmt: string
    post_content: string
    post_title: string
    post_excerpt: string
    post_status: string
    comment_status: string
    ping_status: string
    post_password: string
    post_name: string
    to_ping: string
    pinged: string
    post_modified: string
    post_modified_gmt: string
    post_content_filtered: string
    post_parent: number
    guid: string
    menu_order: number
    post_type: string
    post_mime_type: string
    comment_count: string
    filter: string
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
    mainCategory?: Category;
    mainTag?: ACFTag;
    website?: string;
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
