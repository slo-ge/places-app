import {Observable} from "rxjs";
import {Page, Post} from "./wpObject";
import {MetaMapperData} from "@app/modules/pages/editor/models";


export interface ContentService extends EditorPreviewInfoService{
    getPageBy(slug: string): Observable<Page>;
    getPostBy(slug: string): Observable<Post>;
    getPosts(): Observable<Post[]>;
}

export interface EditorPreviewInfoService {
  /**
   * @param identifier, in most cases it is an URL which will be fetched
   * by the internal API.
   */
  getMetaMapperData(identifier: any): Observable<MetaMapperData>;
}

export enum ApiAdapter {
  WORDPRESS = 'wordpress',
  METADATA = 'meta_data',
  LOREM_IPSUM = 'lorem-ipsum',
  STATIC = 'static'
}
