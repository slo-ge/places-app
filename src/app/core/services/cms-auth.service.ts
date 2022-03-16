import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {tap} from "rxjs/operators";
import {AuthResponse} from "@app/core/services/cms.service";
import {HttpClient} from "@angular/common/http";
import {SimpleLocalCacheService} from "@app/core/services/simple-local-cache.service";
import {environment} from "@environment/environment";

const AUTH_URL = `${environment.CMS_URL}/admin/auth/local`;

@Injectable({
  providedIn: 'root'
})
export class CmsAuthService {
  private currentUser: BehaviorSubject<AuthResponse | null> = new BehaviorSubject<AuthResponse | null>(null);

  constructor(private httpClient: HttpClient,
              private simpleLocalCacheService: SimpleLocalCacheService) { }

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
      this.currentUser.next(this.simpleLocalCacheService.getUser());
    }
    return this.currentUser.asObservable();
  }

  public logout() {
    this.currentUser.next(null);
    this.simpleLocalCacheService.clearUser();
  }
}
