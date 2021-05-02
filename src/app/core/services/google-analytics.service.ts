import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";
import {CookieService} from "@app/core/services/cookie.service";
import {GoogleTagManagerService} from "angular-google-tag-manager";


export enum ActionType {
  CLICK_DOWNLOAD_CANVAS = 'click_download_canvas',
  CLICK_CHANGE_PRESET = 'click_change_preset'
}


@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  constructor(private router: Router,
              private cookieService: CookieService,
              private gtmService: GoogleTagManagerService) {
  }

  init() {
    if (!this.cookieService.isTrackingDisabled()) {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
      ).subscribe(activatedRoute => {
        if (activatedRoute instanceof NavigationEnd) {
          const gtmTag = {
            event: 'page',
            pageName: activatedRoute.url
          };
          this.gtmService.pushTag(gtmTag);
        }
      });

    } else {
      console.warn('TRAAAACKING is disabled');
    }
  }

  public triggerClick(action: ActionType, data: string) {
    if (!this.cookieService.isTrackingDisabled()) {
      this.gtmService.pushTag({
        event: 'click_action',
        data: `${action}: ${data}`,
        action: action
      });
    }
  }
}

