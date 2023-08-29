import { Injectable } from '@angular/core';
import { APP_FALLBACK_CONFIG, ApplicationConfig } from '@shared-lib/config';
import { CmsAuthService } from '@app/core/services/cms-auth.service';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class InitialConfigService {
    private initialConfig!: ApplicationConfig;
    private currentConfig$: ReplaySubject<ApplicationConfig> = new ReplaySubject<ApplicationConfig>();

    constructor(private authService: CmsAuthService) {}

    // Call me only once in modules
    async _initialConfigListener() {
        const url = new URL(window.location.href);
        const referrer = url.host;
        this.authService.getUser().subscribe(async user => {
            const username = user?.user.username || 'default';
            try {
                const res = await fetch('/api/config/' + username + `?referrer=${referrer}`);
                if (res.ok) {
                    this.initialConfig = (await res.json()) as ApplicationConfig;
                } else {
                    this.initialConfig = APP_FALLBACK_CONFIG;
                }
            } catch (err) {
                console.error('Error on fetching config', err);
                this.initialConfig = APP_FALLBACK_CONFIG;
            }
            this.currentConfig$.next(this.initialConfig);
        });
    }

    public getConfig(): Observable<ApplicationConfig> {
        return this.currentConfig$.asObservable();
    }
}
