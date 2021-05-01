import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";
import {CookieService} from "@app/core/services/cookie.service";
import {GoogleTagManagerService} from "angular-google-tag-manager";

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

  public clickAction(title: string) {
    this.gtmService.pushTag({
      event: 'click_action',
      buttonData: title
    });
  }
}
