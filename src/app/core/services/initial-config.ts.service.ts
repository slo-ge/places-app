import { Injectable } from '@angular/core';
import { APP_FALLBACK_CONFIG, ApplicationConfig, FeatureFlags } from "@shared-lib/config";
import { CmsAuthService } from "@app/core/services/cms-auth.service";
import { firstValueFrom, Observable, of } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class InitialConfigTsService {
  private initialConfig!: ApplicationConfig;

  constructor(private authService: CmsAuthService) {
  }

  async fetchInitialConfig() {
    try {
      const user = await firstValueFrom(this.authService.getUser().pipe(map(u => u?.user.username))) || 'default';
      const res = await fetch('/api/config/' + user);
      if (res.ok) {
        this.initialConfig = await res.json() as ApplicationConfig;
      } else {
        this.initialConfig = APP_FALLBACK_CONFIG;
      }
    } catch (err) {
      console.error('Error on fetching config', err);
      this.initialConfig = APP_FALLBACK_CONFIG;
    }
  }

  public getFeatures(): FeatureFlags[] {
    return this.initialConfig.featureFlags || [];
  }

  public getConfig(): Observable<ApplicationConfig> {
    return of(this.initialConfig);
  }
}
