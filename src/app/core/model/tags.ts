/**
 * The Tag which will be provided from wordpress
 */
export interface WPTag {
    id: number; // important
    name: string; // important
    count: number; // important
    description: string;
    link: string;
    slug: string;
    taxonomy: string;
    meta: any[];
    _links: Links;
    acf?: ExtendedInfos;
}

/**
 * Tag which will be provided by using ACFTag
 */
export interface ACFTag {
    term_id: number
    name: string
    slug: string
    term_group: number
    term_taxonomy_id: number
    taxonomy: string
    description: string
    parent: number
    count: number
    filter: string
}

/**
 * Tag which will be hold in state and in other UI Components
 */
export interface UITag {
    name: string;
    count: number;
    id: number;
}

interface Links {
    self: Self[];
    collection: Self[];
    about: Self[];
    'wp:post_type': Self[];
    curies: Cury[];
}

interface Cury {
    name: string;
    href: string;
    templated: boolean;
}

interface Self {
    href: string;
}

interface ExtendedInfos {
    seoTitle: string;
    seoDescription: string;
    seoImage: any;
}

export interface ACFMeta {
    acf: {
        seoTitle: string;
        seoDescription: string;
        seoImage: string;
    }
}
