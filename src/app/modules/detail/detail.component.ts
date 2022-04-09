import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {map, tap} from "rxjs/operators";
import {LocationService} from "../../core/services/location.service";
import {ACFLocation} from "../../core/model/wpObject";
import {SeoService} from "../../core/services/seo.service";
import {getFeaturedImage} from "../../core/utils/media";
import {SafeUrl} from "@angular/platform-browser";
import {getGoogleMapRoute} from "@places/core/utils/maps";
import {Store} from "@ngxs/store";
import {AppState} from "@places/store/app.state";
import {SelectTagAction} from "@places/store/app.actions";
import {UITag} from "@places/core/model/tags";
import {RoutingService} from "@places/core/services/routing.service";

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
    geoUrl: SafeUrl | null = null;

    constructor(private locationService: LocationService,
                private route: ActivatedRoute,
                private seoService: SeoService,
                private store: Store,
                private routingService: RoutingService) {
    }

    location$: Observable<ACFLocation>;
    imgUrl: string;

    ngOnInit() {
        // from resolver
        this.location$ = this.route.data.pipe(
            map(data => data['place']),
            tap((data: ACFLocation) => {
                this.seoService.setMetaFromLocation(data);
                this.seoService.setCanonicalUrl(`detail/${data.slug}`);
                this.imgUrl = getFeaturedImage(data._embedded);
                this.geoUrl = getGoogleMapRoute(data);

                // If there is no current tag set, that means that there was any url pointing to the
                // detail page from outside the application
                // TODO: if a page is set as query param, this should also be removed inside the if as
                if (!this.store.selectSnapshot(AppState.selectedTag) && data.acf?.mainTag && !this.routingService.hasHistory()) {
                    const uiTag: UITag = {
                        name: data.acf.mainTag.name,
                        id: data.acf.mainTag.term_id,
                        count: data.acf.mainTag.count
                    }
                    this.store.dispatch(new SelectTagAction(uiTag));
                }
            })
        );
    }
}
