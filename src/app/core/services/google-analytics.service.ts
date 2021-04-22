import {Injectable} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";

declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  constructor(private router: Router) {
  }

  init() {
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
    })
  }
}
