import {Component, OnInit} from '@angular/core';
import {Info, LocationService} from "../../core/services/location.service";
import {Observable} from "rxjs";
import {ACFLocation} from "../../core/model/location";
import {calculateDistance, GeoLocationService} from "../../core/services/geo-location.service";
import {ActivatedRoute} from "@angular/router";
import {finalize, switchMap, tap} from "rxjs/operators";

interface GeoPosition {
    lat: number;
    lng: number
}

enum SortType {
    DEFAULT = 'default',
    GEO = 'geo'
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
                private geoLocation: GeoLocationService,
                private route: ActivatedRoute) {
    }

    loading = true;

    ngOnInit() {
        this.geoLocation.getPosition().then(
            (position: { lat: number, lng: number }) => {
                this.myPosition = position;
            }
        );

        this.locations$ = this.route.queryParams.pipe(
            tap(() => this.loading = true),
            switchMap((params: { sort: SortType, page: number }) => {
                const sort = params.sort || SortType.DEFAULT;
                let httpParams: any = {page: params.page || 1};

                if (sort === SortType.GEO && this.myPosition) {
                    httpParams = {
                        ...httpParams,
                        geo_location: `{"lat":"${this.myPosition.lat}","lng":"${this.myPosition.lng}","radius":"50"}`
                    }
                }

                return this.locationService.allLocations(httpParams).pipe(
                    finalize(() => this.loading = false)
                )
            })
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

    numberReturn(length) {
        return new Array(length);
    }
}
