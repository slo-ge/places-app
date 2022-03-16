import {Injectable} from '@angular/core';
import {SimpleLocalCacheService} from "@app/core/services/simple-local-cache.service";
import {environment} from "@environment/environment";

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  constructor(private simpleLocalCache: SimpleLocalCacheService) {
  }

  isTrackingDisabled(): boolean {
    if (!environment.production) {
      return true;
    }

    const enabled = this.simpleLocalCache.getItem('cookies');
    return enabled === 'disabled';
  }

  disableCookies() {
    this.simpleLocalCache.setItem('cookies', 'disabled');
  }

  enableCookies() {
    this.simpleLocalCache.setItem('cookies', 'enabled');
  }
}
