import {MediaTypes, WpEmbed} from "../model/embed";

export function getFeaturedImage(embeddedMedia: WpEmbed) {

    if (embeddedMedia["wp:featuredmedia"]) {
        return embeddedMedia["wp:featuredmedia"]
            .find(data => data.media_type = MediaTypes.Image)
            .media_details
            .sizes
            .medium_large
            .source_url;
    }

    return 'https://placehold.it/200x150';

}