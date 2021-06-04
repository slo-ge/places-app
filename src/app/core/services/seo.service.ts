import {Inject, Injectable} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {ACFLocation, WpObject} from "../model/wpObject";
import {environment} from "../../../environments/environment";
import {getFeaturedImage} from "../utils/media";
import {decodeHTMLEntities} from "../utils/html";
import {DOCUMENT} from "@angular/common";


export interface MetaData {
    title?: string;
    description?: string;
    imageUrl?: string;
}

@Injectable({
    providedIn: 'root'
})
export class SeoService {
    constructor(private meta: Meta,
                private title: Title,
                @Inject(DOCUMENT) private dom) {
    }

    private getDefaultMeta(wpObject: WpObject): MetaData {
        return {
            title: `${wpObject.title.rendered} | ${environment.seoTitlePostFix}`,
            imageUrl: getFeaturedImage(wpObject._embedded)
        };
    }

    public setMetaFrom(wpObject: WpObject) {
        this.setMeta(this.getDefaultMeta(wpObject));
    }

    public setMetaFromLocation(acfLocation: ACFLocation) {
        const meta = this.getDefaultMeta(acfLocation);

        let description = acfLocation.acf.description[0].text;
        description = description.replace(/<\/?[^>]+(>|$)/g, "");
        meta.description = `${description.slice(0, 120)}...`;
        this.setMeta(meta)
    }

    public setDefaults() {
        const defaults: MetaData = {
            title: environment.seoTitle,
            description: environment.seoDescription,
            imageUrl: environment.seoImageUrl
        };

        this.setMeta(defaults);
    }

    /**
     * Adds default meta to given meta data
     *
     * @param metaData
     */
    public appendDefaultsWith(metaData: MetaData) {
        if (!(metaData.title && metaData.description)) {
            return;
        }

        const defaults: MetaData = {
            title: `${metaData.title} | ${environment.seoSearchTitle}`,
            description: `${metaData.description} | ${environment.seoDescription}`,
            imageUrl: metaData.imageUrl || environment.seoImageUrl
        };

        this.setMeta(defaults);
    }

    public setMeta(metaData: MetaData) {
        if (metaData.title) {
            metaData.title = decodeHTMLEntities(metaData.title);
            this.title.setTitle(metaData.title);
            this.meta.updateTag({property: 'og:title', content: metaData.title});
            this.meta.updateTag({name: 'title', content: metaData.title});
        }
        if (metaData.description) {
            this.meta.updateTag({name: 'description', content: metaData.description});
            this.meta.updateTag({property: 'og:description', content: metaData.description});
        }
        if (metaData.imageUrl) {
            this.meta.updateTag({property: 'og:image', content: metaData.imageUrl});
        }
    }

    public setCanonicalUrl(path: string) {
        const url = `https://www.goove.at/${path}`;
        const head = this.dom.getElementsByTagName('head')[0];
        let element: HTMLLinkElement = this.dom.querySelector(`link[rel='canonical']`) || null
        if (element == null) {
            element = this.dom.createElement('link') as HTMLLinkElement;
            head.appendChild(element);
        }
        element.setAttribute('rel', 'canonical')
        element.setAttribute('href', url)
    }
}
