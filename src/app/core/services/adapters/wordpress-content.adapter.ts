import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {ContentService} from "../../model/content.service";
import {ContentType, Page, Post, WpObject} from "@app/core/model/wpObject";
import {MetaMapperData} from "@app/modules/pages/editor/models";
import {decodeHTMLEntities, sanitizeHtml} from "@app/core/utils/html";

/**
 * Fetches from Wordpress API posts and pages, which
 * can be viewed in meta-mapper
 */
export class WordpressContentAdapter implements ContentService {
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

  public getMetaMapperData(data: string): Observable<MetaMapperData> {
    return this.getBySlug<Post>(data, ContentType.POST).pipe(
      map(WordpressContentAdapter.mapWordpressObjectToSimpleSetting)
    );
  }

  private static mapWordpressObjectToSimpleSetting(wordpressObject: WpObject): MetaMapperData {
    const imgUrl = wordpressObject._embedded["wp:featuredmedia"]?.[0]?.source_url;
    const description = sanitizeHtml(decodeHTMLEntities(wordpressObject.excerpt.rendered));
    const title = sanitizeHtml(decodeHTMLEntities(wordpressObject.title.rendered));

    return {
      title,
      description,
      image: imgUrl,
      url: 'null'
    }
  }
}