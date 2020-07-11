import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from "@angular/router";
import {slideInAnimation} from "./core/utils/animations";
import {environment} from "../environments/environment";
import {isPlatformBrowser} from "@angular/common";

declare var gtag;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [
        slideInAnimation
    ]
})
export class AppComponent implements OnInit {
    title = 'goove';

    constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: string) {
    }

    ngOnInit(): void {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd && isPlatformBrowser(this.platformId)) {
                gtag('config', environment.gtagKey, {'page_path': event.urlAfterRedirects});
            }
        });
    }

    prepareRoute(outlet: RouterOutlet) {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
    }
}
