import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { BackgroundImage, Font, Preset, PresetObject } from "@app/core/model/preset";
import { EMPTY, Observable } from "rxjs";
import { MetaMapperData } from "@app/modules/pages/editor/models";
import { shareReplay, take } from "rxjs/operators";
import { environment } from "@environment/environment";

export const CMS_API_URL = `${environment.CMS_URL}`;
const LAYOUT_CONFIG_API = `${environment.CMS_URL}/export-latest-layouts`;


/**
 * The strapi response of the auth call
 */
export interface AuthResponse {
  jwt: string,
  user: {
    id: number,
    username: string,
    email: string,
    blocked: boolean | null,
    isAdmin: boolean
  }
}

/**
 * Preview for the home page, which
 * defines an object of an downloaded meta-mapper image
 */
export interface Preview {
  url: string;
  title: string;
  description: string;
  rendered: BackgroundImage;
}

/**
 * Urls which hold data, where the editor can be opened
 * and filled with predefined data
 */
export interface UrlItem {
  name: string;
  url: string;
  presetId?: string;
}

/**
 * The Settings, which where maintained by strapi
 */
export interface Settings {
  GoogleFonts: Font[];
  ExampleUrls: UrlItem[];
  MarketingText: string;
  Imprint: string;
  HelpText: string;
}

export interface Tag {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  presets: Preset[];

}

@Injectable({
  providedIn: 'root'
})
export class CmsService {
  private settings: Observable<Settings> | null = null;
  private tags: Observable<Tag[]> | null = null;
  private presetCache: Map<string, Observable<Preset[]>> = new Map<string, Observable<Preset[]>>();

  constructor(private httpClient: HttpClient) {
  }


  public getPreset(id: string): Observable<Preset> {
    const url = `${CMS_API_URL}/export-latest-layouts/${id}`;
    return this.httpClient.get<Preset>(url);
  }

  /**
   * get all files which should be shown as preview
   */
  public getPreviews(): Observable<Preview[]> {
    return this.httpClient.get<Preview[]>(`${CMS_API_URL}/previews/?_sort=created_at:DESC`);
  }

  /**
   * Fetch Layouts from CMS
   *
   * TODO: just call with additionalQueryParams and not only with presetTag
   */
  public getLayoutSetting(presetTag?: string | null): Observable<Preset[]> {
    let params = new HttpParams()
      .set('_sort', 'sortIndex:asc');

    if (presetTag) {
      params = params.set('preset_tags', presetTag); // limit the layouts to a given preset
    } else {
      params = params.set('highlighted', 'true'); // show only highlighted
    }

    if (this.presetCache.get(params.toString()) === undefined) {
      this.presetCache.set(
        params.toString(),
        this.httpClient.get<Preset[]>(LAYOUT_CONFIG_API, { params }).pipe(take(1), shareReplay(1))
      );
    }

    return this.presetCache.get(params.toString())!;
  }

  /**
   *
   * @param items
   * @param presetId
   */
  public update(items: PresetObject[], presetId: number) {
    const formData = new FormData();
    formData.append('data', JSON.stringify({ itemsJson: items }));
    const url = `${CMS_API_URL}/export-latest-layouts/${presetId}`;
    return this.httpClient.put<Preset>(url, formData);
  }

  /**
   * Uploads a file to the CMS
   * @param file, current file
   * @param data, the file name which can also be queried
   */
  public createPreview(file: File, data: MetaMapperData): Observable<Preview> {
    if (file.size > 2000000) {
      alert(`file size of image to big: ${file.size}, the limit is 2MB`);
      return EMPTY;
    }

    const formData = new FormData();
    formData.append('files.rendered', file, 'mmpreveiw');
    const tmp = {
      url: data.url,
      title: data.title,
      description: data.description
    };
    formData.append('data', JSON.stringify(tmp));

    return this.httpClient.post<Preview>(`${CMS_API_URL}/previews`, formData);
  }

  public getSettings(): Observable<Settings> {
    if (this.settings) {
      return this.settings;
    }
    this.settings = this.httpClient.get<Settings>(`${CMS_API_URL}/meta-mapper-settings`)
      .pipe(shareReplay(1));
    return this.settings;
  }

  public getPresetTags() {
    if (!this.tags) {
      this.tags = this.httpClient.get<Tag[]>(`${CMS_API_URL}/preset-tags`)
        .pipe(shareReplay(1));
    }

    return this.tags;
  }

  /**
   * static images can be used in templates
   */
  public getStaticImages(additionalParameter: string = '') {
    const url = 'upload/files?_limit=1000&_start=0&_sort=updated_at:DESC&caption=static-image' + additionalParameter;
    return this.httpClient.get<BackgroundImage[]>(`${CMS_API_URL}/${url}`);
  }
}


