import {Injectable} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {WpObject} from "../model/wpObject";
import {environment} from "../../../environments/environment";
import {getFeaturedImage} from "../utils/media";


interface MetaData {
  title?: string;
  description?: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(private meta: Meta,
              private title: Title) {
  }

  public setMetaFrom(wpObject: WpObject) {
    const meta: MetaData = {
      title: `${wpObject.title.rendered} | ${environment.seoTitlePostFix}`,
      imageUrl: getFeaturedImage(wpObject._embedded)
    };

    this.setMeta(meta);
  }

  public setDefaults() {
    const defaults: MetaData = {
      title: environment.seoTitle,
      description: environment.seoDescription,
      imageUrl: environment.seoImageUrl
    };

    this.setMeta(defaults);
  }

  public setMeta(metaData: MetaData) {
    if (metaData.title) {
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
}
