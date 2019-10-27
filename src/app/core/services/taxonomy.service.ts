import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Tag} from "../model/tags";

export const BASE_URL = 'https://locations.phipluspi.com/wp-json/wp/v2/tags';

@Injectable({
  providedIn: 'root'
})
export class TaxonomyService {

  constructor(private httpClient: HttpClient) { }

  public getTags(): Observable<Tag[]> {
    return this.httpClient.get<Tag[]>(BASE_URL);
  }
}
