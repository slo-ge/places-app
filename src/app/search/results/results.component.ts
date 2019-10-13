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

    params = {
      page: 1,
      geo_location: null,
    };

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

    // TODO: rename
    sortBy(order: string) {
        this.geoLocation.getPosition().then(
            (position: { lat: number, lng: number }) => {
                this.myPosition = position;
                // TODO: refactore stuff make radius global
                this.updateParams({
                  geo_location: `{"lat":"${position.lat}","lng":"${position.lng}","radius":"50"}`
              });
            }
        )
    }

    loadPage(page: number) {
      this.updateParams({page: page});
    }

    updateParams(params: any){
      this.params = {
        ...this.params,
        ...params
      };
      this.locations$ = this.locationService.allLocations(this.params);
    }

    numberReturn(length) {
        return new Array(length);
    }
}
