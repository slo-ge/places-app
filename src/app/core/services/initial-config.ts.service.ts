import {Injectable} from '@angular/core';
import {APP_DEFAULT_CONFIG, ApplicationConfig} from "@shared-lib/config";
import {CmsAuthService} from "@app/core/services/cms-auth.service";
import {firstValueFrom} from "rxjs";
import {map} from "rxjs/operators";

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
        this.initialConfig = APP_DEFAULT_CONFIG;
      }
    } catch (err) {
      console.error('Error on fetching config', err);
      this.initialConfig = APP_DEFAULT_CONFIG;
    }
  }
}
