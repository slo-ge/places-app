import {Injectable} from '@angular/core';
import {PRESET_TAG_DATA, PresetTagDataItem} from "@app/core/seo/data";

@Injectable({
  providedIn: 'root'
})
export class SeoDataService {

  constructor() {
  }

  /**
   * Returns the meta data for a given tag
   * @param id
   */
  getSeoForPresetTag(id: number): PresetTagDataItem | undefined {
    return PRESET_TAG_DATA.find(i => i.id === id);
  }
}
