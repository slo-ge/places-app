import {Observable} from "rxjs";
import {Page, Post} from "./wpObject";
import {InjectionToken} from "@angular/core";
import {SimplePreviewCanvasSetting} from "@app/modules/pages/editor/models";

export const CONTENT_SERVICE = new InjectionToken<ContentService>('content.service');

// This proxy proxies any url and sets the cors origin to * to make
// every content access by browser
export const PROXY_URL = 'https://cors-anywhere.herokuapp.com';

export interface ContentService extends EditorPreviewInfoService{
    getPageBy(slug: string): Observable<Page>;
    getPostBy(slug: string): Observable<Post>;
    getPosts(): Observable<Post[]>;
}

export interface EditorPreviewInfoService {
  getEditorPreviewSettings(identifier: any): Observable<SimplePreviewCanvasSetting>;
}

export enum ApiAdapter {
  WORDPRESS = 'wordpress',
  METADATA = 'meta_data'
}
