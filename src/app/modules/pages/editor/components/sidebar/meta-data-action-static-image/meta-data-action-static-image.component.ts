import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BackgroundImage} from "@app/core/model/preset";
import {CmsService} from "@app/core/services/cms.service";
import {Observable} from "rxjs";
import {map, mergeMap, take, toArray} from "rxjs/operators";
import {toAbsoluteCMSUrl} from "@app/core/editor/utils";

interface StaticImage {
    url: string;
    thumbnailUrl: string;
}

@Component({
  selector: 'app-meta-data-action-static-image',
  templateUrl: './meta-data-action-static-image.component.html',
  styleUrls: ['./meta-data-action-static-image.component.scss']
})
export class MetaDataActionStaticImageComponent implements OnInit {
  @Output()
  selectStaticImageUrl = new EventEmitter<string>();

  staticImages$: Observable<StaticImage[]> | null = null;

  constructor(private cmsService: CmsService) {
  }

  ngOnInit(): void {
    this.staticImages$ = this.cmsService.getStaticImages().pipe(
      take(1),
      mergeMap(image => image),
      map(image => ({
            thumbnailUrl: toAbsoluteCMSUrl(image.formats.thumbnail.url),
            url:toAbsoluteCMSUrl(image.url)
        })),
      toArray()
    );
  }

  selectImage(image: StaticImage) {
    this.selectStaticImageUrl.emit(image.url);
  }
}
