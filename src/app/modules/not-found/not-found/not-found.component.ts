import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MainRoutes} from "@places/core/utils/routing";
import {RESPONSE} from "@nguniversal/express-engine/tokens";

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
    MainRoutes = MainRoutes;
    private readonly response: any;

    constructor(@Optional() @Inject(RESPONSE) response: any) {
        this.response = response;
    }

    ngOnInit(): void {
        if (this.response) {
            this.response.status(404);
        }
    }
}
