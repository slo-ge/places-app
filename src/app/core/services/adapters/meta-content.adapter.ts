import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {MetaMapperData} from "@app/modules/pages/editor/models";
import {EditorPreviewInfoService} from "@app/core/model/content.service";
import {environment} from "@environment/environment";

export interface MetaData {
  metaDescription: string;
  ogDescription: string;
  ogImage: string;
  ogTitle: string;
  title: string;
  iconUrl?: string;
  price?: {
    lowestPrice: Number | string | null;
    highestPrice: Number | string | null;
    currency: Number | string | null;
    displayPrice: string | null;
  },
  otherImages?: string[];
}

/**
 * Downloads meta data of certain given website by internal api
 */
export class MetaContentAdapter implements EditorPreviewInfoService {
  private readonly META_ENDPOINT: string = `${environment.API_URL}/meta`;

  constructor(private httpClient: HttpClient) {
  }

  getMetaMapperData(url: string): Observable<MetaMapperData> {
    const b64url = btoa(url);
    return this.httpClient.get<MetaData>(`${this.META_ENDPOINT}/${b64url}`).pipe(
      map(data => ({
        title: data.title,
        description: data.metaDescription,
        image: data.ogImage,
        iconUrl: data.iconUrl,
        url,
        displayPrice: data.price?.displayPrice,
        otherImages: data.otherImages
      }))
    );
  }
}