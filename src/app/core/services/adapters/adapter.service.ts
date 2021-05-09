import {Injectable} from '@angular/core';
import {WordpressContentAdapter} from "@app/core/services/adapters/wordpress-content.adapter";
import {ApiAdapter, ContentService, EditorPreviewInfoService} from "@app/core/model/content.service";
import {HttpClient} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {MetaContentAdapter} from "@app/core/services/adapters/meta-content.adapter";
import {of} from "rxjs";
import {LoremIpsumContentAdapter} from "@app/core/services/adapters/lorem-ipsum-content-adapter.service";
import {StaticContentAdapter} from "@app/core/services/adapters/static-content.adapter";


@Injectable({
  providedIn: 'root'
})
export class AdapterService {
  constructor(private httpClient: HttpClient) {
  }

  /**
   * @param queryParamsSnapshot, the current snapshot where we try to guess the service from
   */
  public getService(queryParamsSnapshot: any): ContentService | EditorPreviewInfoService {
    let apiUrl = queryParamsSnapshot.get('apiUrl');
    const adapterName: ApiAdapter = queryParamsSnapshot.get('adapter');

    if (adapterName === ApiAdapter.WORDPRESS && apiUrl) {
      // this is hacky af
      apiUrl = apiUrl.replace('wordpress://', '');
      return new WordpressContentAdapter(this.httpClient, apiUrl);
    }

    if (adapterName === ApiAdapter.METADATA) {
      return new MetaContentAdapter(this.httpClient);
    }

    if (adapterName === ApiAdapter.LOREM_IPSUM) {
      return new LoremIpsumContentAdapter();
    }

    if (adapterName === ApiAdapter.STATIC) {
      return new StaticContentAdapter(queryParamsSnapshot);
    }

    console.error('no API Adapter found for', adapterName);
    console.error('returning wordpress Adapter');
    console.error('import test posts from assets \'/assets/posts\'');
    return new WordpressContentAdapter(this.httpClient, '/assets/posts');
  }

  /**
   * Checks if the given url can be linked with an adapter
   * @param url
   */
  public async findAdapter(url: string): Promise<ApiAdapter> {
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

    const metaService = new MetaContentAdapter(this.httpClient);
    const isMetaObject = await metaService.getMetaMapperData(url).pipe(
      map(() => true),
      catchError(() => of(false))
    ).toPromise();


    if (isMetaObject) {
      return ApiAdapter.METADATA;
    }

    return Promise.reject();
  }
}
