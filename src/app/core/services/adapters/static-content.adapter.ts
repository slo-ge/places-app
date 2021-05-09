import {ApiAdapter, EditorPreviewInfoService} from "@app/core/model/content.service";
import {Observable, of} from "rxjs";
import {MetaMapperData} from "@app/modules/pages/editor/models";
import {getCurrentTextOfFabricObject} from "@app/core/editor/fabric-object.utils";
import {LayoutItemType} from "@app/core/model/preset";
import {PresetService} from "@app/core/editor/preset.service";
import {ParamMap} from "@angular/router";

export class StaticContentAdapter implements EditorPreviewInfoService {

  constructor(private data: ParamMap) {
  }

  /**
   * Maps the data of the current
   * @param _identifier
   */
  getMetaMapperData(_identifier: any): Observable<MetaMapperData> {
    return of({
      title: this.data.get('title') || '',
      description: this.data.get('description') || '',
      url: 'static entry with no url',
      image: this.data.get('imageUrl'),
      iconUrl: this.data.get('iconUrl')
    });
  }

  /**
   * Creates a shareable URL which also get's the modified texts and
   * the rest of the predefined preset.
   *
   * @param presetService, current presetService
   */
  public static shareUrl(presetService: PresetService) {
    const preset = presetService!.metaMapperData;
    const url = new URL(`${window.location.origin}/editor`);
    const title = getCurrentTextOfFabricObject(presetService!.canvas, LayoutItemType.TITLE);
    const description = getCurrentTextOfFabricObject(presetService!.canvas, LayoutItemType.DESCRIPTION);

    url.searchParams.append('title', title || '');
    url.searchParams.append('description', description || '');
    url.searchParams.append('presetId', `${presetService?.preset.id}`);
    url.searchParams.append('adapter', ApiAdapter.STATIC);
    url.searchParams.append('imageUrl', preset.image || '');
    url.searchParams.append('iconUrl', preset.iconUrl || '');

    return url;
  }
}
