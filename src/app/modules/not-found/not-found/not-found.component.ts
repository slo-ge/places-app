import {Component} from '@angular/core';
import {MainRoutes} from "@places/core/utils/routing";

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {
    MainRoutes = MainRoutes;

    constructor() {
    }
}
