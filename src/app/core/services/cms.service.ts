import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BackgroundImage, Preset, PresetObject} from "@app/core/model/preset";
import {BehaviorSubject, EMPTY, Observable, of} from "rxjs";
import {tap} from "rxjs/operators";
import {SimpleLocalCacheService} from "@app/core/services/simple-local-cache.service";
import {MetaMapperData} from "@app/modules/pages/editor/models";

export const CMS_API_URL = '/cms';
const LAYOUT_CONFIG_API = '/cms/export-latest-layouts';
const AUTH_URL = '/cms/admin/auth/local';

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

@Injectable({
  providedIn: 'root'
})
export class CmsService {
  private currentUser: BehaviorSubject<AuthResponse | null> = new BehaviorSubject<AuthResponse | null>(null);

  constructor(private httpClient: HttpClient,
              private simpleLocalCacheService: SimpleLocalCacheService) {
  }


  public getPreset(id: string): Observable<Preset> {
    const url = `${CMS_API_URL}/export-latest-layouts/${id}`;
    return this.httpClient.get<Preset>(url);
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

  /**
   * get all files which should be shown as preview
   */
  public getPreviews(): Observable<Preview[]> {
    return this.httpClient.get<Preview[]>(`${CMS_API_URL}/previews/?_sort=created_at:DESC`);
  }

  public token(user: string, password: string): Observable<AuthResponse> {
    let body = new URLSearchParams();

    body.set('identifier', user);
    body.set('password', password);


    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    return this.httpClient.post<AuthResponse>(AUTH_URL, body.toString(), {headers}).pipe(
      tap(data => {
        this.currentUser.next(data);
        this.simpleLocalCacheService.setUser(data);
      })
    );
  }

  public getUser(): Observable<AuthResponse | null> {
    if (this.simpleLocalCacheService.getUser()) {
      return of(this.simpleLocalCacheService.getUser());
    }
    return of(this.simpleLocalCacheService.getUser());
    // TODO:
    //return this.currentUser.asObservable();
  }

  public logout() {
    this.currentUser.next(null);
    this.simpleLocalCacheService.clearUser();
  }
}
