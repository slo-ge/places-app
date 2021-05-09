import {EditorPreviewInfoService} from "@app/core/model/content.service";
import {Observable, of} from "rxjs";
import {MetaMapperData} from "@app/modules/pages/editor/models";

export class StaticContentAdapter implements EditorPreviewInfoService {

  constructor(private data: any) {
  }

  getMetaMapperData(_identifier: any): Observable<MetaMapperData> {
    console.log(this.data.get('url'));
    return of({
      title: this.data.get('title'),
      description: this.data.get('description'),
      url: 'static entry with no url',
      image: this.data.get('imageUrl'),
      iconUrl: this.data.get('iconUrl')
    });
  }
}
