import {Component, OnInit} from '@angular/core';
import {combineLatest, Observable} from "rxjs";
import {ActivatedRoute, Params} from "@angular/router";
import {finalize, map, switchMap, take, tap} from "rxjs/operators";
import {ACFLocation, GeoPosition} from "../../../core/model/wpObject";
import {LocationService} from "../../../core/services/location.service";
import {Select, Store} from "@ngxs/store";
import {SelectTagAction} from "../../../store/app.actions";
import {TaxonomyService} from "../../../core/services/taxonomy.service";
import {Tag} from "../../../core/model/tags";
import {AppState} from "../../../store/app.state";


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
    @Select(AppState.selectedTag)
    tag$: Observable<Tag>;
    @Select(AppState.geoPosition)
    currentLocation$: Observable<GeoPosition>; // TODO:

    locations$: Observable<ACFLocation[]>;

    params = {page: 1, geo_location: null};
    currentPage: 1;
    loading = true;

    constructor(private locationService: LocationService,
                private route: ActivatedRoute,
                private store: Store,
                private tagService: TaxonomyService) {
    }

    ngOnInit() {
        this.initPaginated();
    }

    initPaginated() {
        const queryParams$ = this.route.queryParams;
        this.locations$ = combineLatest([queryParams$, this.currentLocation$]).pipe(
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

        if (sort === SortType.GEO && geoLocation) {
            httpParams = {
                ...httpParams,
                geo_location: `{"lat":"${geoLocation.lat}","lng":"${geoLocation.lng}","radius":"50"}`
            };
        }

        // TODO: improve
        if (params.tags) {

            // TODO: make a nicer dispatch service
            this.tagService.getTagFrom(params.tags)
                .pipe(take(1))
                .subscribe(tag => this.store.dispatch(new SelectTagAction(tag)));

            httpParams = {
                ...httpParams,
                tags: params.tags
            };
        } else {
            this.store.dispatch(new SelectTagAction(null));
        }

        return httpParams;
    }
}
