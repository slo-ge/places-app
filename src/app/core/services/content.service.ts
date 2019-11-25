import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {WpObject} from "../model/wpObject";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

export const BASE_URL = 'https://locations.phipluspi.com/wp-json/wp/v2';

export interface Post extends WpObject {
  acf: {
    relatedPlaces: [{
      place: {
        ID: number
      }
    }]
  }
};

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(private httpClient: HttpClient) {
  }

  public getPageBy(slug: string): Observable<WpObject> {
    return this.getBySlug(slug, 'pages');
  }

  public getPostBy(slug: string): Observable<Post> {
    return this.getBySlug<Post>(slug, 'posts');
  }

  public getPosts(): Observable<Post[]> {
    // TODO: we receive full object, maybe make this more dynamic
    return this.httpClient.get<Post[]>(`${BASE_URL}/posts?_embed`);
  }

  private getBySlug<T>(slug: string, contentType: string): Observable<T> {
    // TODO: refactor embed
    return this.httpClient.get<T>(`${BASE_URL}/${contentType}?slug=${slug}&_embed`).pipe(
      map(data => data[0])
    );
  }
}
