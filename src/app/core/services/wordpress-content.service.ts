import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {ContentService} from "../model/content.service";
import {ContentType, Page, Post, WpObject} from "@app/core/model/wpObject";


export class WordpressContentService implements ContentService {
  private readonly apiUrl: string;
  private readonly params = {
    _embed: ''
  };

  constructor(private httpClient: HttpClient, apiUrl: string) {
    this.apiUrl = `${apiUrl}/wp-json/wp/v2`;
  }

  public getPageBy(slug: string): Observable<WpObject> {
    return this.getBySlug<Page>(slug, ContentType.PAGE);
  }

  public getPostBy(slug: string): Observable<Post> {
    return this.getBySlug<Post>(slug, ContentType.POST);
  }

  public getPosts(): Observable<Post[]> {
    return this.httpClient.get<Post[]>(`${this.apiUrl}/${ContentType.POST}`, {params: this.params});
  }

  private getBySlug<T>(slug: string, contentType: ContentType): Observable<T> {
    return this.httpClient.get<T[]>(
      `${this.apiUrl}/${contentType}`,
      {params: {...this.params, slug: slug}}
    ).pipe(map(data => data[0]));
  }
}
