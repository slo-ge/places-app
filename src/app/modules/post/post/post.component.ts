import {Component, OnInit} from '@angular/core';
import {ContentService, Post} from "../../../core/services/content.service";
import {Observable} from "rxjs";
import {ACFLocation} from "../../../core/model/wpObject";
import {ActivatedRoute} from "@angular/router";
import {getFeaturedImage} from "../../../core/utils/media";
import {WpEmbed} from "../../../core/model/embed";
import {LocationService} from "../../../core/services/location.service";
import {switchMap} from "rxjs/operators";


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  posts$: Observable<Post[]>;
  post$: Observable<Post>;
  related$: Observable<ACFLocation[]>;

  constructor(private contentService: ContentService,
              private locationService: LocationService,
              private router: ActivatedRoute) {
  }

  ngOnInit() {
    const id = this.router.snapshot.params['id'];

    if (id) {
      this.post$ = this.contentService.getPostBy(id);
      this.related$ = this.post$.pipe(
        switchMap(data => this.locationService.getPlaceByIds(data.acf.relatedPlaces.map(data => data.place.ID)))
      );
    } else {
      this.posts$ = this.contentService.getPosts();
    }
  }

  getImageUrl(em: WpEmbed) {
    return getFeaturedImage(em);
  }
}
