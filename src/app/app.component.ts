import {Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {slideInAnimation} from "./core/utils/animations";

declare var gtag;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [
        slideInAnimation
    ]
})
export class AppComponent {
    title = 'goove';

    constructor() {
    }


    prepareRoute(outlet: RouterOutlet) {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
    }
}
