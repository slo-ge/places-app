import {Component, OnInit} from '@angular/core';
import {Observable, of} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {tap} from "rxjs/operators";
import {LocationService} from "../../core/services/location.service";
import {ACFLocation} from "../../core/model/wpObject";
import {SeoService} from "../../core/services/seo.service";
import {getFeaturedImage} from "../../core/utils/media";

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

    constructor(private locationService: LocationService,
                private route: ActivatedRoute,
                private seoService: SeoService) {
    }

    location$: Observable<ACFLocation>;
    imgUrl: string;

    ngOnInit() {
        // from resolver
        this.location$ = of(this.route.snapshot.data['place']).pipe(
            tap((data: ACFLocation) => {
                this.seoService.setMetaFromLocation(data);
                this.seoService.setCanonicalUrl(data.slug);
                this.imgUrl = getFeaturedImage(data._embedded);
            })
        );
    }
}
