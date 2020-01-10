import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {ACFLocation, Post} from "../../../core/model/wpObject";
import {ActivatedRoute} from "@angular/router";
import {getFeaturedImage} from "../../../core/utils/media";
import {WpEmbed} from "../../../core/model/embed";
import {LocationService} from "../../../core/services/location.service";
import {finalize, switchMap, tap} from "rxjs/operators";
import {SeoService} from "../../../core/services/seo.service";
import {WPContentService} from "../../../core/services/wpcontent.service";


@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
    posts$: Observable<Post[]>;
    post$: Observable<Post>;
    related$: Observable<ACFLocation[]>;

    loading = true;

    constructor(private contentService: WPContentService,
                private locationService: LocationService,
                private router: ActivatedRoute,
                private seoService: SeoService) {
    }

    ngOnInit() {
        const id = this.router.snapshot.params['id'];
        if (id) {
            this.post$ = this.contentService.getPostBy(id).pipe(
                tap(data => this.seoService.setMetaFrom(data))
            );

            this.related$ = this.post$.pipe(
                switchMap(data => this.locationService.getPlaceByIds(data.acf.relatedPlaces.map(data => data.place.ID))),
                finalize(() => this.loading = false)
            );

        } else {
            this.posts$ = this.contentService.getPosts().pipe(
                finalize(() => this.loading = false)
            );
        }
    }

    getImageUrl(em: WpEmbed) {
        return getFeaturedImage(em);
    }
}
