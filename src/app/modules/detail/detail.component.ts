import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {map, switchMap, tap} from "rxjs/operators";
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

    this.location$ = this.route.params.pipe(
      switchMap(params => this.locationService.getPlace(params['slug'])),
      map(places => places[0]),
      tap(data => this.seoService.setMetaFrom(data)),
      tap(data => this.imgUrl = getFeaturedImage(data._embedded))
    );
  }
}
