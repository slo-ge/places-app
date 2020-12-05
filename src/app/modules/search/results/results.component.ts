import {Component, OnInit} from '@angular/core';
import {combineLatest, Observable} from "rxjs";
import {ActivatedRoute, Params} from "@angular/router";
import {finalize, map, switchMap, take, tap} from "rxjs/operators";
import {ACFLocation} from "../../../core/model/wpObject";
import {LocationService} from "../../../core/services/location.service";
import {GeoLocationService} from "../../../core/services/geo-location.service";
import {Select, Store} from "@ngxs/store";
import {SelectFullTextQuery, SelectGeoLoactionAction, SelectTagAction} from "../../../store/app.actions";
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

    locations$: Observable<ACFLocation[]>;
    geoLocation$: Promise<any>;

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
        // TODO: maybe we can handle this in query params handler
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

        // map fullTextQuery query param to wordpress search param
        // TODO: move this to a different search service
        // TODO: may we can handle this in query params handler
        if (params.fullTextQuery) {
            // TODO: this should be also handled more nice
            this.store.dispatch(new SelectFullTextQuery(params.fullTextQuery));
            httpParams = {
                ...httpParams,
                search: params.fullTextQuery
            }
        } else {
            this.store.dispatch(new SelectFullTextQuery(null));
        }

        return httpParams;
    }
}
