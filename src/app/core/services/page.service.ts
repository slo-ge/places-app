import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {WpObject} from "../model/wpObject";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

export const BASE_URL = 'https://locations.phipluspi.com/wp-json/wp/v2';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  constructor(private httpClient: HttpClient) {
  }

  public getPageBy(slug: string): Observable<WpObject> {
    return this.httpClient.get<WpObject>(`${BASE_URL}/pages?slug=${slug}`).pipe(
      map( data => data[0])
    );
  }
}
