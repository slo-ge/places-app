import {Injectable} from '@angular/core';
import {ContentService} from "../model/content.service";
import {ContentType, Page, Post} from "../model/wpObject";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

export const ASSETS_CACHED_PATH = './assets/cached'

// TODO: this service is WIP
@Injectable({
    providedIn: 'root'
})
export class CachedWPContentServiceService implements ContentService {

    constructor(private httpClient: HttpClient) {
    }

    getPageBy(slug: string): Observable<Page> {
        return this.getBySlug(ContentType.PAGE, slug);
    }

    getPostBy(slug: string): Observable<Post> {
        return this.getBySlug(ContentType.POST, slug);
    }

    getPosts(): Observable<Post[]> {
        return this.httpClient.get<Post[]>(
            `${ASSETS_CACHED_PATH}/${ContentType.POST}.json`,
        );
    }

    private getBySlug<T>(type: ContentType, slug: string): Observable<T> {
        return this.httpClient.get<T>(
            `${ASSETS_CACHED_PATH}/${type}/${slug}.json`,
        );
    }
}
