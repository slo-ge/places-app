import {Component, OnInit} from '@angular/core';
import {combineLatest, EMPTY, Observable} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {catchError, finalize, map, switchMap, take, tap} from "rxjs/operators";
import {ACFLocation} from "@places/core/model/wpObject";
import {LocationService} from "@places/core/services/location.service";
import {GeoLocationService} from "@places/core/services/geo-location.service";
import {Store} from "@ngxs/store";
import {SelectFullTextQuery, SelectTagAction} from "@places/store/app.actions";
import {TaxonomyService} from "@places/core/services/taxonomy.service";
import {WPTag} from "@places/core/model/tags";
import {MetaData, SeoService} from "@places/core/services/seo.service";
import {MainRoutes} from "@places/core/utils/routing";


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
    locations$: Observable<ACFLocation[]>;
    geoLocation$: Promise<any> | any;

    currentPage: 1;
    loading = false;

    currentSeoData$: Observable<MetaData>;

    constructor(private locationService: LocationService,
                private geoLocation: GeoLocationService,
                private route: ActivatedRoute,
                private store: Store,
                private tagService: TaxonomyService,
                private seoService: SeoService,
                private router: Router) {
    }

    ngOnInit() {
        const queryParams$ = this.route.queryParams;
        const paths$ = this.route.params as Observable<RouteParam>;
        const tags$ = this.tagService.getTags();

        this.locations$ = combineLatest([queryParams$, paths$, tags$]).pipe(
            tap(() => this.loading = true),
            map(([queryParams, params, tags]) => this.buildPlacesResponseFrom(queryParams, params, tags)),

            switchMap(mappedParams => this.locationService.allLocations(mappedParams).pipe(
                finalize(() => this.loading = false),
                catchError(() => {
                    this.router.navigate(["/404-not-found"]);
                    return EMPTY;
                }),
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
    private buildPlacesResponseFrom(queryParams: Params, params: RouteParam, tags: WPTag[]) {
        this.seoService.setCanonicalUrlForResultList(queryParams, params);

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

            // Add tag to UI if it exists
            this.tagService.getTagFromString(params.slug).pipe(
                take(1),
                tap(tag => {
                    if (tag) {
                        this.currentSeoData$ = this.tagService.getMetaForTag(tag.id).pipe(
                            tap(data => this.seoService.appendDefaultsWith(data))
                        );
                    } else {
                        console.error(`tag: ${tag} from params: "${params.slug}" does not exist`);
                    }
                })
            ).subscribe(tag => this.store.dispatch(new SelectTagAction(tag)));


            // If tag is available then add it to query params for api request
            // If tag is not available we redirect to 404 page
            const tag = tags.find(tag => tag.slug == params.slug);
            if (tag) {
                httpParams = {...httpParams, tags: tag.id};
            } else {
                this.router.navigate([MainRoutes.NOT_FOUND]);
                return;
            }
        }


        // Map fullTextQuery query param to wordpress search param
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


        // If no slug (tag) and no fulltextQuery is set is set we always hide
        // these items which should not be visible in our default view
        if (!params.slug && !queryParams.fullTextQuery) {
            httpParams = {...httpParams, categories_exclude: 111};
        }

        return httpParams;
    }
}
