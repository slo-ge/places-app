import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Preset, PresetObject} from "@app/core/model/preset";
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

  /**
   *
   */
  public getLayoutSetting(): Observable<Preset[]> {
    let params = new HttpParams().set('highlighted', 'true');

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
