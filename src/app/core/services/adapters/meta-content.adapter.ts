import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {EditorPreviewInfoService} from "../../model/content.service";
import {MetaMapperData} from "@app/modules/pages/editor/models";

export interface MetaData {
  metaDescription: string;
  ogDescription: string;
  ogImage: string;
  ogTitle: string;
  title: string;
  iconUrl?: string;
}

export class MetaContentAdapter implements EditorPreviewInfoService {
  private readonly apiUrl: string;

  constructor(private httpClient: HttpClient) {
    this.apiUrl = '/api/meta';
  }

  getMetaMapperData(url: string): Observable<MetaMapperData> {
    const b64url = btoa(url);
    return this.httpClient.get<MetaData>(`${this.apiUrl}/${b64url}`).pipe(
      map(data => ({
        title: data.title,
        description: data.metaDescription,
        image: data.ogImage,
        iconUrl: data.iconUrl,
        url
      }))
    );
  }
}
