import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Preset, PresetObject} from "@app/core/model/preset";
import {BehaviorSubject, EMPTY, Observable, of} from "rxjs";
import {tap} from "rxjs/operators";
import {SimpleLocalCacheService} from "@app/core/services/simple-local-cache.service";

export const CMS_API_URL = 'http://dev-tools.at:1337';
const LAYOUT_CONFIG_API = 'http://dev-tools.at:1337/export-latest-layouts';
const AUTH_URL = 'http://dev-tools.at:1337/admin/auth/local';

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

  public getLayoutSetting(): Observable<Preset[]> {
    return this.httpClient.get<Preset[]>(LAYOUT_CONFIG_API);
  }

  public update(items: PresetObject[]) {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    for (let item of items) {
      const url = `${CMS_API_URL}/export-latest-items/${item.id}`;
      const body = new URLSearchParams(item as any);
      this.httpClient.put(url, body.toString(), {headers}).subscribe(console.log);
    }
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
