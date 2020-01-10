import {Observable} from "rxjs";
import {Page, Post} from "./wpObject";
import {InjectionToken} from "@angular/core";

export const CONTENT_SERVICE = new InjectionToken<ContentService>('content.service');

export interface ContentService {
    getPageBy(slug: string): Observable<Page>;

    getPostBy(slug: string): Observable<Post>;

    getPosts(): Observable<Post[]>;
}
