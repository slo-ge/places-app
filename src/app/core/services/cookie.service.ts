import {Injectable} from '@angular/core';
import {SimpleLocalCacheService} from "@app/core/services/simple-local-cache.service";

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  constructor(private simpleLocalCache: SimpleLocalCacheService) {
  }

  isTrackingDisabled(): boolean {
    const enabled = this.simpleLocalCache.getItem('cookies');
    return enabled === 'disabled';
  }
}
