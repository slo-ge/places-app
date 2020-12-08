import {Observable} from "rxjs";
import {Page, Post} from "./wpObject";
import {InjectionToken} from "@angular/core";
import {SimplePreviewCanvasSetting} from "@app/modules/pages/editor/models";

export const CONTENT_SERVICE = new InjectionToken<ContentService>('content.service');



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
