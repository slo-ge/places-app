import {Component, OnInit} from '@angular/core';
import {combineLatest, Observable} from "rxjs";
import {ActivatedRoute, Params} from "@angular/router";
import {finalize, map, switchMap, take, tap} from "rxjs/operators";
import {ACFLocation} from "@places/core/model/wpObject";
import {LocationService} from "@places/core/services/location.service";
import {GeoLocationService} from "@places/core/services/geo-location.service";
import {Select, Store} from "@ngxs/store";
import {SelectFullTextQuery, SelectTagAction} from "@places/store/app.actions";
import {TaxonomyService} from "@places/core/services/taxonomy.service";
import {Tag} from "@places/core/model/tags";
import {AppState} from "@places/store/app.state";


export enum SortType {
    DEFAULT = 'default',
    GEO = 'geo'
}

interface RouteParam {
    slug: string;
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
    geoLocation$: Promise<any> | any;

    params = {page: 1, geo_location: null};
    currentPage: 1;
    loading = false;

    constructor(private locationService: LocationService,
                private geoLocation: GeoLocationService,
                private route: ActivatedRoute,
                private store: Store,
                private tagService: TaxonomyService) {
    }

    ngOnInit() {
        this.initPaginated();
    }

    initPaginated() {
        const queryParams$ = this.route.queryParams;
        const paths$ = this.route.params as Observable<RouteParam>;
        const tags$ = this.tagService.getTags();

        this.locations$ = combineLatest([queryParams$, paths$, tags$]).pipe(
            tap(() => this.loading = true),
            map(([queryParams, params, tags]) => this.buildPlacesResponseFrom(queryParams, params, tags)),
            switchMap(mappedParams => this.locationService.allLocations(mappedParams).pipe(
                finalize(() => this.loading = false)
            ))
        );
    }

    /**
     * Query parameter mapping for rest call.
     * Buildingi
     * @param queryParams
     * @param params
     * @param tags
     */
    private buildPlacesResponseFrom(queryParams: Params, params: RouteParam, tags: Tag[]) {
        const sort = queryParams.sort || SortType.DEFAULT;
        let httpParams: any = {page: queryParams.page || 1};

        /*if (!!geoLocation) {
            this.store.dispatch(new SelectGeoLoactionAction(geoLocation));
        }

        if (sort === SortType.GEO && geoLocation) {
            httpParams = {
                ...httpParams,
                geo_location: `{"lat":"${geoLocation.lat}","lng":"${geoLocation.lng}","radius":"50"}`
            };
        }*/

        // TODO: improve
        // TODO: maybe we can handle this in query queryParams handler
        // TODO: make a nicer dispatch service
        // this behavior sets the new tag for frontend
        if (params.slug) {
            this.tagService.getTagFromString(params.slug)
                .pipe(take(1))
                .subscribe(tag => this.store.dispatch(new SelectTagAction(tag)));

            httpParams = {
                ...httpParams,
                tag: tags.find(tag => tag.slug == params.slug)
            };
        }

        // map fullTextQuery query param to wordpress search param
        // TODO: move this to a different search service
        // TODO: may we can handle this in query queryParams handler
        if (queryParams.fullTextQuery) {
            // TODO: this should be also handled more nice
            this.store.dispatch(new SelectFullTextQuery(queryParams.fullTextQuery));
            httpParams = {
                ...httpParams,
                search: queryParams.fullTextQuery
            }
        }
        return httpParams;
    }
}
