import {Component, OnInit} from '@angular/core';
import {combineLatest, EMPTY, Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {finalize, switchMap, tap} from "rxjs/operators";
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
    styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
    locations$: Observable<ACFLocation[]>;
    currentPage: 1;
    geoLocation$: Promise<any>;
    tag$: Observable<Tag>;

    params = {
        page: 1,
        geo_location: null,
    };

    constructor(private locationService: LocationService,
                private geoLocation: GeoLocationService,
                private route: ActivatedRoute,
                private store: Store,
                private tagService: TaxonomyService) {
    }

    loading = true;

    ngOnInit() {
        this.geoLocation$ = this.geoLocation.getPosition();
        this.initPaginated();
    }

    initPaginated() {
        const queryParams$ = this.route.queryParams;
        this.locations$ = combineLatest([queryParams$, this.geoLocation$]).pipe(
            tap(() => this.loading = true),
            switchMap(([params, locations]) => {
                const sort = params.sort || SortType.DEFAULT;
                let httpParams: any = {page: params.page || 1};

                if (!!locations) {
                    this.store.dispatch(new SelectGeoLoactionAction(locations));
                }

                if (sort === SortType.GEO && locations) {
                    httpParams = {
                        ...httpParams,
                        geo_location: `{"lat":"${locations.lat}","lng":"${locations.lng}","radius":"50"}`
                    }
                }

                // TODO: improve
                if (params.tags){
                    this.tag$ = this.tagService.getTagFrom(params.tags);
                    httpParams = {
                        ...httpParams,
                        tags: params.tags
                    }
                } else {
                    this.tag$ = EMPTY;
                }

                return this.locationService.allLocations(httpParams).pipe(
                    finalize(() => this.loading = false)
                )
            })
        );
    }
}
