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


export enum ContentType {
    PAGE = 'pages',
    POST = 'posts'
}


export interface Post extends WpObject {
}

export interface Page extends WpObject {
}
