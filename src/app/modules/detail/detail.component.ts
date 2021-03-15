import {Component, OnInit} from '@angular/core';
import {Observable, of} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {tap} from "rxjs/operators";
import {LocationService} from "../../core/services/location.service";
import {ACFLocation} from "../../core/model/wpObject";
import {SeoService} from "../../core/services/seo.service";
import {getFeaturedImage} from "../../core/utils/media";
import {SafeUrl} from "@angular/platform-browser";
import {Platform} from "@angular/cdk/platform";

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
                public platform: Platform) {
    }

    location$: Observable<ACFLocation>;
    imgUrl: string;

    ngOnInit() {
        // from resolver
        this.location$ = of(this.route.snapshot.data['place']).pipe(
            tap((data: ACFLocation) => {
                this.seoService.setMetaFromLocation(data);
                this.seoService.setCanonicalUrl(`detail/${data.slug}`);
                this.imgUrl = getFeaturedImage(data._embedded);

                if (this.platform.IOS) {
                    this.geoUrl = `maps://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=${data.acf.place.lat},${data.acf.place.lng}`;
                } else {
                    this.geoUrl = `https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=${data.acf.place.lat},${data.acf.place.lng}`;
                }
            })
        );
    }
}
