import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  OnChanges,
  OnInit,
  Output, SimpleChanges
} from '@angular/core';
import {BackgroundImage} from "@app/core/model/preset";
import {CmsService} from "@app/core/services/cms.service";
import {Observable} from "rxjs";
import {finalize, map, mergeMap, take, toArray} from "rxjs/operators";
import {toAbsoluteCMSUrl} from "@app/core/editor/utils";
import {MetaDataActionsComponent} from "@app/modules/pages/editor/components/sidebar/meta-data-actions/meta-data-actions.component";


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
  height = 0; // if

  @HostBinding('attr.style')
  get setStyle() {
    let height = 0;
    // NOTE: workaround for not adding antother height if elementRef changes,
    //       which leads to hasbeendchecked expression
    if (this.height) {
      height = this.height;
    } else {
      if (!window || !this.elementRef?.nativeElement) {
        return null;
      }

      // 80 -> footer
      height = window.innerHeight - this.elementRef.nativeElement.offsetTop - 80;
    }
    this.height = height;
    return `max-height: ${height}px`;
  }

  staticImages$: Observable<StaticImage[]> | null = null;
  loading = true;


  constructor(private cmsService: CmsService,
              private elementRef: ElementRef) {
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
