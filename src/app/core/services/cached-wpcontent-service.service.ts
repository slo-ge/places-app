import {Injectable} from '@angular/core';
import {ContentService} from "../model/content.service";
import {Page, Post} from "../model/wpObject";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

const BASE_URL = './assets/cached'

// TODO: WIP
@Injectable({
    providedIn: 'root'
})
export class CachedWPContentServiceService implements ContentService {

    constructor(private httpClient: HttpClient) {
    }

    getPageBy(slug: string): Observable<Page> {
        return this.getBySlug(slug);
    }

    getPostBy(slug: string): Observable<Post> {
        return this.getBySlug(slug);
    }

    getPosts(): Observable<Post[]> {
        return undefined;
    }

    private getBySlug<T>(slug: string): Observable<T> {
        return this.httpClient.get<T>(
            `${BASE_URL}/${slug}`,
        );
    }
}
