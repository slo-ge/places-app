import {Component, ElementRef, EventEmitter, HostBinding, OnInit, Output} from '@angular/core';
import {BackgroundImage} from "@app/core/model/preset";
import {CmsService} from "@app/core/services/cms.service";
import {Observable} from "rxjs";
import {finalize, map, mergeMap, take, toArray} from "rxjs/operators";
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

  @HostBinding('attr.style')
  get setStyle() {
    if (!window || !this.elementRef?.nativeElement) {
      return null;
    }

    // 80 -> footer
    const height = window.innerHeight - this.elementRef.nativeElement.offsetTop - 80;
    return `max-height: ${height}px`;
  }

  staticImages$: Observable<StaticImage[]> | null = null;
  loading = true;



  constructor(private cmsService: CmsService, private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    this.staticImages$ = this.cmsService.getStaticImages().pipe(
      take(1),
      mergeMap(image => image),
      map(image => ({
        thumbnailUrl: toAbsoluteCMSUrl(MetaDataActionStaticImageComponent.getSmallestUrl(image)),
        url: toAbsoluteCMSUrl(image.url)
      })),
      toArray(),
      finalize(() => this.loading = false)
    );
  }

  selectImage(image: StaticImage) {
    this.selectStaticImageUrl.emit(image.url);
  }

  private static getSmallestUrl(image: BackgroundImage) {
    if (image.formats?.thumbnail?.url) {
      return image.formats.thumbnail.url;
    }

    return image.url;
  }
}
