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
      title: 'Heading: you can edit this text box',
      description: 'Welcome to the meta-mapper edit mode. By clicking on this text, you can change it, you can also change the font size, the color, or the font type. It\'s also possible to change or remove this image.' ,
      image: 'https://www.phipluspi.com/wp-content/uploads/2021/04/lorem-ipsum.jpg',
      iconUrl: 'https://www.meta-mapper.com/assets/meta/android-icon-192x192.png',
      url: 'https://www.meta-mapper.com'
    });
  }
}
