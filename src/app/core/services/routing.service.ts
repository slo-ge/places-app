import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {filter, map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class RoutingService {
    urls: string[] = [];

    constructor(private router: Router) {
    }

    // only call on startup of application
    init() {

        return this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            map((e: NavigationEnd) => this.urls.push(e.url))
        ).subscribe();
    }

    /**
     * If we do have already made some angular routing,
     * that means that we are opened the detail page
     * from external service. i.e. google or something
     */
    hasHistory() {
        return this.urls.length > 1;
    }
}
