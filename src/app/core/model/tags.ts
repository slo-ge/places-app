export interface Tag {
    id: number; // important
    name: string; // important
    count: number; // important
    description: string;
    link: string;
    slug: string;
    taxonomy: string;
    meta: any[];
    _links: Links;
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