import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BackgroundImage, Preset, PresetObject} from "@app/core/model/preset";
import {BehaviorSubject, Observable, of} from "rxjs";
import {tap} from "rxjs/operators";
import {SimpleLocalCacheService} from "@app/core/services/simple-local-cache.service";

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
   * @param fileName, the file name which can also be quieried
   */
  public uploadFile(file: File, fileName:string = 'mmpreview') {
    const formData = new FormData();
    formData.append('files', file, fileName);
    return this.httpClient.post(`${CMS_API_URL}/upload`, formData);
  }

  /**
   * get all files which should be shown as preview
   */
  public getPreviews(): Observable<BackgroundImage[]> {
    return this.httpClient.get<BackgroundImage[]>(`${CMS_API_URL}/upload/search/mmpreview?sort=created_at::desc`);
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

    return this.currentUser.asObservable();
  }

  public logout() {
    this.currentUser.next(null);
    this.simpleLocalCacheService.clearUser();
  }
}
