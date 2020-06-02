import {Component, OnInit} from '@angular/core';
import {SwUpdate, UpdateAvailableEvent} from "@angular/service-worker";
import {Observable} from "rxjs";
import {VERSION} from "version";
import {SelectGeoLoactionAction} from "../../store/app.actions";
import {Store} from "@ngxs/store";
import {GeoLocationService} from "../../core/services/geo-location.service";

@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

    isSwUpdateAvailable = false;
    availableUpdate$: Observable<UpdateAvailableEvent>;

    constructor(private swUpdate: SwUpdate, private store: Store, private geoLocation: GeoLocationService) {
    }

    ngOnInit() {
        this.isSwUpdateAvailable = this.swUpdate.isEnabled;
        if (this.swUpdate.isEnabled) {
            this.availableUpdate$ = this.swUpdate.available;
        }
    }

    reload() {
        window.location.reload();
    }

    get version(){
        return VERSION.build;
    }

    activateGeoLocation() {
        this.geoLocation.getPosition().then(
            data => {
                this.store.dispatch(new SelectGeoLoactionAction(data))
            }
        );
    }
}
