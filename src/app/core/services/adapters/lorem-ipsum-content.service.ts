import {Injectable} from '@angular/core';
import {EditorPreviewInfoService} from "@app/core/model/content.service";
import {Observable, of} from "rxjs";
import {MetaMapperData} from "@app/modules/pages/editor/models";

@Injectable({
  providedIn: 'root'
})
export class LoremIpsumContentService implements EditorPreviewInfoService {

  constructor() {
  }

  getMetaMapperData(_identifier: any): Observable<MetaMapperData> {
    return of({
      title: 'Welcome to Meta-Mapper.com',
      description: 'The concept of MetaMapper is very simple. MetaMapper is based on so called "meta tags" which are snippets of text or images which are related to a website, i.e. blog posts, websites, or other content. "Meta Tags" ...',
      image: 'https://www.phipluspi.com/wp-content/uploads/2021/01/diagram-768x434.jpg',
      iconUrl: 'https://www.meta-mapper.com/assets/meta/android-icon-192x192.png',
      url: 'https://www.meta-mapper.com'
    });
  }
}
