import {Component, OnInit} from '@angular/core';
import {SwUpdate, UpdateAvailableEvent} from "@angular/service-worker";
import {Observable} from "rxjs";
import {VERSION} from "version";

@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

    isSwUpdateAvailable = false;
    availableUpdate$: Observable<UpdateAvailableEvent>;

    constructor(private swUpdate: SwUpdate) {}

    ngOnInit() {
        this.isSwUpdateAvailable = this.swUpdate.isEnabled;
        if (this.swUpdate.isEnabled) {
            this.availableUpdate$ = this.swUpdate.available;
        }
    }

    reload() {
        window.location.reload();
    }

    get buildDate() {
        return VERSION.buildDate;
    }
}
