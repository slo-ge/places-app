import {HttpClient} from "@angular/common/http";
import {EMPTY, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {ContentService} from "../model/content.service";
import {MetaProperties} from "@app/modules/pages/editor/models";

export interface MetaData {
  metaDescription: string;
  ogDescription: string;
  ogImage: string;
  ogTitle: string;
  title: string;
  iconUrl?: string;
}

export class MetaContentService implements ContentService {
  private readonly apiUrl: string;

  constructor(private httpClient: HttpClient) {
    this.apiUrl = 'https://dev-tools.at/meta';
  }

  public getPageBy(slug: string): Observable<any> {
    console.error('do not call');
    return EMPTY;
  }

  public getPostBy(slug: string): Observable<any> {
    console.error('do not call');
    return EMPTY
  }

  public getPosts(): Observable<any> {
    console.error('do not call');
    return EMPTY;
  }

  getEditorPreviewSettings(url: string): Observable<MetaProperties> {
    url = btoa(url);
    return this.httpClient.get<MetaData>(`${this.apiUrl}/${url}`).pipe(
      map(data => ({
        title: data.title,
        description: data.metaDescription,
        image: data.ogImage,
        iconUrl: data.iconUrl
      }))
    );
  }
}
