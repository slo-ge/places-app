import {Injectable} from '@angular/core';
import {Meta, Title} from "@angular/platform-browser";
import {SeoDataService} from "@app/core/seo/seo-data.service";

export interface MetaData {
  title?: string;
  description?: string;
}

export const SEO_TITLE_TAG_PREFIX = 'MetaMapper | beautiful presets of ';
export const SEO_DESCRIPTION_TAG_PREFIX = 'MetaMapper provides you a beautiful selection of presets and themes for ';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(private meta: Meta,
              private title: Title,
              private seoDataService: SeoDataService) {
  }

  setSeoForPresetTag(tagId: number) {
    if (!tagId) {
      return;
    }

    const presetData = this.seoDataService.getSeoForPresetTag(tagId);
    if (presetData) {
      this.setMeta({
        title: SEO_TITLE_TAG_PREFIX + presetData.title,
        description: SEO_DESCRIPTION_TAG_PREFIX + presetData.title
      });
    }
  }

  private setMeta(metaData: MetaData) {
    if (metaData.title) {
      this.title.setTitle(metaData.title);
      this.meta.updateTag({property: 'og:title', content: metaData.title});
      this.meta.updateTag({name: 'title', content: metaData.title});
    }
    if (metaData.description) {
      this.meta.updateTag({name: 'description', content: metaData.description});
      this.meta.updateTag({property: 'og:description', content: metaData.description});
    }
  }
}
