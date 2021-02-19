import {Observable} from "rxjs";
import {Page, Post} from "./wpObject";
import {MetaProperties} from "@app/modules/pages/editor/models";


export interface ContentService extends EditorPreviewInfoService{
    getPageBy(slug: string): Observable<Page>;
    getPostBy(slug: string): Observable<Post>;
    getPosts(): Observable<Post[]>;
}

export interface EditorPreviewInfoService {
  getEditorPreviewSettings(identifier: any): Observable<MetaProperties>;
}

export enum ApiAdapter {
  WORDPRESS = 'wordpress',
  METADATA = 'meta_data',
  LOREM_IPSUM = 'lorem-ipsum'
}
