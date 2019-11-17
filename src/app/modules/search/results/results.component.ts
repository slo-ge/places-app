import {Component, OnInit} from '@angular/core';
import {combineLatest, EMPTY, Observable} from "rxjs";
import {ActivatedRoute, Params} from "@angular/router";
import {finalize, map, switchMap, tap} from "rxjs/operators";
import {ACFLocation} from "../../../core/model/location";
import {LocationService} from "../../../core/services/location.service";
import {GeoLocationService} from "../../../core/services/geo-location.service";
import {Store} from "@ngxs/store";
import {SelectGeoLoactionAction} from "../../../store/app.actions";
import {TaxonomyService} from "../../../core/services/taxonomy.service";
import {Tag} from "../../../core/model/tags";


export enum SortType {
    DEFAULT = 'default',
    GEO = 'geo'
}


@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss', './loading-animation.scss']
})
export class ResultsComponent implements OnInit {
    locations$: Observable<ACFLocation[]>;
    geoLocation$: Promise<any>;
    tag$: Observable<Tag>;

    params = {page: 1, geo_location: null};
    currentPage: 1;
    loading = true;

    constructor(private locationService: LocationService,
                private geoLocation: GeoLocationService,
                private route: ActivatedRoute,
                private store: Store,
                private tagService: TaxonomyService) {
    }

    ngOnInit() {
        this.geoLocation$ = this.geoLocation.getPosition();
        this.initPaginated();
    }

    initPaginated() {
        const queryParams$ = this.route.queryParams;
        this.locations$ = combineLatest([queryParams$, this.geoLocation$]).pipe(
            tap(() => this.loading = true),
            map(([params, location]) => this.buildPlacesResponseFrom(params, location)),
            switchMap(mappedParams => this.locationService.allLocations(mappedParams).pipe(
                finalize(() => this.loading = false)
            ))
        );
    }

    /**
     * Query parameter mapping for rest call.
     * Buildingi
     * @param params
     * @param geoLocation
     */
    private buildPlacesResponseFrom(params: Params, geoLocation: { lat: number, lng: number }) {
        const sort = params.sort || SortType.DEFAULT;
        let httpParams: any = {page: params.page || 1};

        if (!!geoLocation) {
            this.store.dispatch(new SelectGeoLoactionAction(geoLocation));
        }

        if (sort === SortType.GEO && geoLocation) {
            httpParams = {
                ...httpParams,
                geo_location: `{"lat":"${geoLocation.lat}","lng":"${geoLocation.lng}","radius":"50"}`
            };
        }

        // TODO: improve
        if (params.tags) {
            this.tag$ = this.tagService.getTagFrom(params.tags);
            httpParams = {
                ...httpParams,
                tags: params.tags
            };
        } else {
            this.tag$ = EMPTY;
        }

        return httpParams;
    }
}
