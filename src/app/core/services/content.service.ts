import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ContentType, Post, WpObject} from "../model/wpObject";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

export const BASE_URL = 'https://locations.phipluspi.com/wp-json/wp/v2';


@Injectable({
    providedIn: 'root'
})
export class ContentService {

    private readonly params = {
        _embed: ''
    };

    constructor(private httpClient: HttpClient) {
    }

    public getPageBy(slug: string): Observable<WpObject> {
        return this.getBySlug(slug, ContentType.PAGE);
    }

    public getPostBy(slug: string): Observable<Post> {
        return this.getBySlug<Post>(slug, ContentType.POST);
    }

    public getPosts(): Observable<Post[]> {
        return this.httpClient.get<Post[]>(`${BASE_URL}/${ContentType.POST}`, {params: this.params});
    }

    private getBySlug<T>(slug: string, contentType: ContentType): Observable<T> {
        return this.httpClient.get<T>(
            `${BASE_URL}/${contentType}`,
            {params: {...this.params, slug: slug}}
        ).pipe(map(data => data[0]));
    }
}
