import {Injectable} from '@angular/core';
import {WordpressContentService} from "@app/core/services/wordpress-content.service";
import {ApiAdapter, ContentService} from "@app/core/model/content.service";
import {HttpClient} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {MetaContentService} from "@app/core/services/meta-content.service";
import {of} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class AdapterService {

  constructor(private httpClient: HttpClient) {
  }


  getService(queryParamsSnapshot: any): ContentService {
    const apiUrl = queryParamsSnapshot.get('apiUrl');
    const adapterName: ApiAdapter = queryParamsSnapshot.get('adapter');

    if (adapterName === ApiAdapter.WORDPRESS && apiUrl) {
      return new WordpressContentService(this.httpClient, apiUrl);
    }

    if (adapterName === ApiAdapter.METADATA) {
      return new MetaContentService(this.httpClient);
    }

    console.error('no API Adapter found for', adapterName);
    console.error('returning wordpress Adapter');
    console.error('import test posts from assets \'/assets/posts\'');
    return new WordpressContentService(this.httpClient, '/assets/posts');
  }

  async findAdapter(url: string): Promise<ApiAdapter> {

    const isWordpress = await this.httpClient.get(url + '/wp-json/').pipe(
      map(() => true),
      catchError(() => of(false))
    ).toPromise();

    if (isWordpress) {
      return ApiAdapter.WORDPRESS;
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
