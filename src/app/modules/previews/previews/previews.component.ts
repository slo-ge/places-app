import {Component, OnInit} from '@angular/core';
import {CmsService} from "@app/core/services/cms.service";
import {EMPTY, Observable} from "rxjs";
import {BackgroundImage} from "@app/core/model/preset";
import {map, shareReplay} from "rxjs/operators";

@Component({
  selector: 'app-previews',
  templateUrl: './previews.component.html',
  styleUrls: ['./previews.component.scss']
})
export class PreviewsComponent implements OnInit {
  open = false;

  images: Observable<BackgroundImage[]> = EMPTY;
  currentImage: Observable<BackgroundImage> = EMPTY;
  currentIndex = 0;
  loading = true;

  constructor(private cmsService: CmsService) {
  }

  ngOnInit(): void {
    this.images = this.cmsService.getPreviews().pipe(shareReplay(1));
    this.currentImage = this.images.pipe(
      map(data => data[this.currentIndex])
    );
  }

  indexOf(index: number) {
    this.loading = true;

    this.currentImage = this.images.pipe(
      map(data => {
        if (index < 0) {
          return data[0];
        }

        if (index >= data.length) {
          return data[data.length - 1];
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
