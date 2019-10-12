import {Component, OnInit} from '@angular/core';
import {Info, LocationService} from "../../core/services/location.service";
import {Observable} from "rxjs";
import {ACFLocation} from "../../core/model/location";
import {calculateDistance, GeoLocationService} from "../../core/services/geo-location.service";

interface GeoPosition {
    lat: number;
    lng: number
}

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
    locations$: Observable<ACFLocation[]>;
    myPosition: GeoPosition;
    currentPage: 1;
    searchInfo$: Observable<Info>;

    constructor(private locationService: LocationService,
                private geoLocation: GeoLocationService) {
    }

    ngOnInit() {
        this.locations$ = this.locationService.allLocations(
            {page: this.currentPage || 1}
        );

        this.searchInfo$ = this.locationService.getInfo();
    }

    calcDistance(location: ACFLocation, myPos: GeoPosition) {
        return calculateDistance(
            location.acf.place.lat,
            myPos.lat,
            location.acf.place.lng,
            myPos.lng
        )
    }

    sortBy(order: string) {
        this.geoLocation.getPosition().then(
            (position: { lat: number, lng: number }) => {
                this.myPosition = position;
                this.locations$ = this.locationService.allLocationsByGeo(position);
            }
        )
    }

    loadPage(page: number) {
        this.locations$ = this.locationService.allLocations({page: page});
    }

    numberReturn(length) {
        return new Array(length);
    }
}
