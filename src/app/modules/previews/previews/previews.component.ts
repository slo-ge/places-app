import {Component, OnInit} from '@angular/core';
import {CmsService, Preview} from "@app/core/services/cms.service";
import {EMPTY, Observable} from "rxjs";
import {BackgroundImage} from "@app/core/model/preset";
import {map, shareReplay, tap} from "rxjs/operators";

@Component({
  selector: 'app-previews',
  templateUrl: './previews.component.html',
  styleUrls: ['./previews.component.scss']
})
export class PreviewsComponent implements OnInit {
  open = false;

  previews: Observable<Preview[]> = EMPTY;
  currentPreview: Observable<Preview> = EMPTY;
  currentIndex = 0;
  loading = true;

  constructor(private cmsService: CmsService) {
  }

  ngOnInit(): void {
    this.previews = this.cmsService.getPreviews().pipe(
      shareReplay(1)
    );
    this.currentPreview = this.previews.pipe(
      map(data => data[this.currentIndex])
    );
  }

  indexOf(index: number) {
    this.loading = true;

    this.currentPreview = this.previews.pipe(
      map(data => {
        if (index < 0) {
          return data[0];
        }

        if (index >= data.length-1) {
          this.currentIndex = 0;
          return data[0];
        }

        return data[index];
      })
    );
  }

  next() {
    this.indexOf(++this.currentIndex);
  }

  prev() {
    this.indexOf(--this.currentIndex);
  }

  toggle() {
    this.open = !this.open;
  }

  onImageLoad(event: Event) {
    if(event && event.target) {
      this.loading = false;
    }
  }
}
