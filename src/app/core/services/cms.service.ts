import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BackgroundImage, Font, Preset, PresetObject} from "@app/core/model/preset";
import {EMPTY, Observable} from "rxjs";
import {MetaMapperData} from "@app/modules/pages/editor/models";
import {shareReplay} from "rxjs/operators";

export const CMS_API_URL = '/cms';
const LAYOUT_CONFIG_API = '/cms/export-latest-layouts';


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

export interface Preview {
  url: string;
  title: string;
  description: string;
  rendered: BackgroundImage;
}
export interface UrlItem {
  name: string;
  url: string;
  presetId?: string;
}

export interface Settings {
  GoogleFonts: Font[];
  ExampleUrls: UrlItem[];
}

@Injectable({
  providedIn: 'root'
})
export class CmsService {
  private settings: Observable<Settings> | null = null;

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
   *
   */
  public getLayoutSetting(): Observable<Preset[]> {
    let params = new HttpParams()
      .set('highlighted', 'true') // show only highlighted
      .set('_sort', 'updated_at:desc'); // show last edited first

    return this.httpClient.get<Preset[]>(LAYOUT_CONFIG_API, {params});
  }

  /**
   *
   * @param items
   * @param presetId
   */
  public update(items: PresetObject[], presetId: number) {
    const formData = new FormData();
    formData.append('data', JSON.stringify({itemsJson: items}));
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
    if(this.settings) {
      return this.settings;
    }
    this.settings =  this.httpClient.get<Settings>(`${CMS_API_URL}/meta-mapper-settings`)
      .pipe(shareReplay(1));
    return this.settings;
  }
}


