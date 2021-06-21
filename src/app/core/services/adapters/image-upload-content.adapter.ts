import {EditorPreviewInfoService} from "@app/core/model/content.service";
import {Observable, of} from "rxjs";
import {MetaMapperData} from "@app/modules/pages/editor/models";
import {ParamMap} from "@angular/router";

/**
 * This adapter takes an blobUrl which will be resolved from fabricjs
 * without using the proxy for the images.
 *
 * NOTE: blob images are only available in the current session, so these
 * images will not be able to be shared among different windows or browser or even
 * devices.
 */
export class ImageUploadContentAdapter implements EditorPreviewInfoService {

  constructor(private data: ParamMap) {
    if (this.data.get('blobUrl') === null) {
      console.error('blobUrl must not be null');
    }
  }

  /**
   * Maps the data of the current
   * @param _identifier
   */
  getMetaMapperData(_identifier: any): Observable<MetaMapperData> {
    return of({
      title: 'Your title',
      description: 'Your description',
      url: '',
      image: this.data.get('blobUrl'),
      iconUrl: null
    });
  }
}
