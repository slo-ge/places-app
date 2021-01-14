import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Preset, PresetObject} from "@app/core/model/preset";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

export const CMS_API_URL = 'http://dev-tools.at:1337';
const LAYOUT_CONFIG_API = 'http://dev-tools.at:1337/export-latest-layouts';
const AUTH_URL = 'http://dev-tools.at:1337/admin/auth/local';

interface AuthResponse {
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
export class LayoutSettingService {
  private jwt: string | null = null; // TODO: use observable
  private currentUser: string | null = null; // TODO: make this correct

  constructor(private httpClient: HttpClient) {
  }

  public getLayoutSetting(): Observable<Preset[]> {
    return this.httpClient.get<Preset[]>(LAYOUT_CONFIG_API);
  }

  public update(items: PresetObject[]) {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${this.jwt}`
    };

    for (let item of items) {
      const url = `http://dev-tools.at:1337/export-latest-items/${item.id}`;
      const body = new URLSearchParams(item as any);
      this.httpClient.put(url, body.toString(), {headers}).subscribe(console.log);
    }
  }

  public auth(user: string, password: string): Observable<AuthResponse> {
    let body = new URLSearchParams();

    body.set('identifier', user);
    body.set('password', password);


    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    return this.httpClient.post<AuthResponse>(AUTH_URL, body.toString(), {headers}).pipe(
      tap(data => {this.jwt = data.jwt; this.currentUser = data.user.username})
    );
  }

  public logout(){
    this.jwt = null;
  }
}
