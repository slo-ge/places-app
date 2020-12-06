import {Injectable} from '@angular/core';
import {WordpressContentService} from "@app/core/services/wordpress-content.service";
import {ApiAdapter, ContentService} from "@app/core/model/content.service";
import {HttpClient} from "@angular/common/http";


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
    console.error('no API Adapter found for', adapterName);
    console.error('returning wordpress Adapter');
    console.error('import test posts from assets \'/assets/posts\'');
    return new WordpressContentService(this.httpClient, '/assets/posts');
  }
}
