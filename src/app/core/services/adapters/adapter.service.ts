import {Injectable} from '@angular/core';
import {WordpressContentService} from "@app/core/services/adapters/wordpress-content.service";
import {ApiAdapter, ContentService, EditorPreviewInfoService} from "@app/core/model/content.service";
import {HttpClient} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {MetaContentService} from "@app/core/services/adapters/meta-content.service";
import {of} from "rxjs";
import {LoremIpsumContentService} from "@app/core/services/adapters/lorem-ipsum-content.service";


@Injectable({
  providedIn: 'root'
})
export class AdapterService {
  constructor(private httpClient: HttpClient) {
  }

  getService(queryParamsSnapshot: any): ContentService | EditorPreviewInfoService {
    let apiUrl = queryParamsSnapshot.get('apiUrl');
    const adapterName: ApiAdapter = queryParamsSnapshot.get('adapter');

    if (adapterName === ApiAdapter.WORDPRESS && apiUrl) {
      // this is hacky af
      apiUrl = apiUrl.replace('wordpress://', '');
      return new WordpressContentService(this.httpClient, apiUrl);
    }

    if (adapterName === ApiAdapter.METADATA) {
      return new MetaContentService(this.httpClient);
    }

    if (adapterName === ApiAdapter.LOREM_IPSUM) {
      return new LoremIpsumContentService();
    }

    console.error('no API Adapter found for', adapterName);
    console.error('returning wordpress Adapter');
    console.error('import test posts from assets \'/assets/posts\'');
    return new WordpressContentService(this.httpClient, '/assets/posts');
  }

  async findAdapter(url: string): Promise<ApiAdapter> {
    if (url.length === 0) {
      return ApiAdapter.LOREM_IPSUM;
    }

    if (url.startsWith('wordpress://')) { // this is hacky af
      url = url.replace('wordpress://', '');
      const isWordpress = await this.httpClient.get(url + '/wp-json/').pipe(
        map(() => true),
        catchError(() => of(false))
      ).toPromise();

      if (isWordpress) {
        return ApiAdapter.WORDPRESS;
      }
    }

    const metaService = new MetaContentService(this.httpClient);
    const isMetaObject = await metaService.getEditorPreviewSettings(url).pipe(
      map(() => true),
      catchError(() => of(false))
    ).toPromise();


    if (isMetaObject) {
      return ApiAdapter.METADATA;
    }

    return Promise.reject();
  }
}
