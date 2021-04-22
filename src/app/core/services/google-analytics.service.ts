import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";
import {CookieService} from "@app/core/services/cookie.service";

declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  constructor(private router: Router, private cookieService: CookieService) {
  }

  init() {
    if (!this.cookieService.isTrackingDisabled()) {

      (window as any).dataLayer = (window as any).dataLayer || [];

      function gtag() {
        // @ts-ignore
        dataLayer.push(arguments);
      }

      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
      ).subscribe(activatedRoute => {
        // @ts-ignore
        gtag('config', 'G-P8ZD58Z83D',
          {
            'page_path': (activatedRoute as NavigationEnd).urlAfterRedirects
          }
        );
      });

    } else {
      console.warn('TRAAAACKING is disabled');
    }
  }
}
