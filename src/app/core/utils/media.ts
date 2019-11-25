import {MediaTypes, WpEmbed} from "../model/embed";

export function getFeaturedImage(embeddedMedia: WpEmbed): string {

    if (embeddedMedia["wp:featuredmedia"]) {
        const sizes = embeddedMedia["wp:featuredmedia"]
            .find(data => data.media_type = MediaTypes.Image)
            .media_details
            .sizes;

        if (sizes.medium_large) {
            return sizes.medium_large.source_url;
        } else {
            sizes.full.source_url;
        }

    }

    return 'assets/branding/logo-written.png';
}
