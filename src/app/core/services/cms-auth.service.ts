import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthResponse } from '@app/core/services/cms.service';
import { HttpClient } from '@angular/common/http';
import { SimpleLocalCacheService } from '@app/core/services/simple-local-cache.service';
import { environment } from '@environment/environment';

@Injectable({
    providedIn: 'root',
})
export class CmsAuthService {
    private readonly ADMIN_AUTH_URL = `${environment.CMS_URL}/admin/auth/local`;
    private readonly NORMAL_USER_URL = `${environment.CMS_URL}/auth/local`;

    private currentUser: BehaviorSubject<AuthResponse | null> = new BehaviorSubject<AuthResponse | null>(null);

    constructor(private httpClient: HttpClient, private simpleLocalCacheService: SimpleLocalCacheService) {}

    public token(user: string, password: string): Observable<AuthResponse> {
        let body = new URLSearchParams();
        let authUrl = this.NORMAL_USER_URL;
        if (user.startsWith('admin:')) {
            user = user.replace('admin:', '');
            authUrl = this.ADMIN_AUTH_URL;
        }
        body.set('identifier', user);
        body.set('password', password);

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        return this.httpClient.post<AuthResponse>(authUrl, body.toString(), { headers }).pipe(
            tap(data => {
                this.currentUser.next(data);
                this.simpleLocalCacheService.setUser(data);
            })
        );
    }

    public getUser(): Observable<AuthResponse | null> {
        if (!this.currentUser.getValue() && this.simpleLocalCacheService.getUser()?.user.username) {
            this.currentUser.next(this.simpleLocalCacheService.getUser());
        }

        return this.currentUser.asObservable();
    }

    public isAdmin(): Observable<boolean> {
        return this.currentUser.pipe(map(u => !!u?.user.isAdmin));
    }

    public logout() {
        this.currentUser.next(null);
        this.simpleLocalCacheService.clearUser();
    }
}
