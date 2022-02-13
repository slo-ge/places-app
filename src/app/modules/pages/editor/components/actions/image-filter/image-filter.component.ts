import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {
  CustomImageFilter,
  defaultFilters,
  ImageFilterType,
  PresetImageFilterService
} from "@app/core/editor/preset-image-filter.service";
import {CustomImageBox} from "@app/core/editor/fabric-object.utils";
import {resetFabricImage} from "@app/core/editor/utils";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {getScaledImage} from "@app/core/editor/canvas.utils";

interface UIImageFilter {
  /**
   * Representation of the current image with the applied filter as
   * preview
   */
  imageUrl: Promise<SafeUrl>;
  /**
   * Information about the current filter which should be applied
   */
  filter: CustomImageFilter;
}

const cache: Map<string, SafeUrl> = new Map<string, SafeUrl>();

@Component({
  selector: 'app-image-filter',
  templateUrl: './image-filter.component.html',
  styleUrls: ['./image-filter.component.scss']
})
export class ImageFilterComponent implements OnChanges {
  @Input()
  imageObject!: CustomImageBox;

  open = false;
  filters!: UIImageFilter[];
  loading = true;
  loadedCount = 0;

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.open && changes.imageObject) {
      this.resetComponent();
      this.filters = this.getFilter();
    }
  }

  toggleFilters() {
    this.open = !this.open;
    if (this.open) {
      this.resetComponent();
      this.filters = this.getFilter();
    }
  }

  getFilter() {
    return defaultFilters.map(f => ({filter: f, imageUrl: this.applyFilterObjCopy(this.imageObject, f)}));
  }


  resetComponent() {
    this.loading = true;
    this.loadedCount = 0;
  }

  applyFilter(obj: CustomImageBox, filter: ImageFilterType) {
    PresetImageFilterService.apply(obj, [filter]);
    this.imageObject.canvas!.renderAll();
    return obj;
  }

  resetAllFilter() {
    resetFabricImage(this.imageObject);
    this.imageObject.applyFilters();
    this.imageObject.canvas!.renderAll();
  }

  loaded() {
    this.loadedCount++;
    if (this.loadedCount === this.filters.length) {
      this.loading = false;
    }
  }

  /**
   * Creates a canvas clone from the current object
   * Then makes a temp blob url for the canvas
   */
  private async applyFilterObjCopy(obj: CustomImageBox, filter: CustomImageFilter): Promise<SafeUrl> {
    const hash = this.imageHash(obj.getSrc(), filter.type);
    if (cache.has(hash)) {
      return cache.get(hash)!;
    }
    const clone = await new Promise<CustomImageBox>((resolve, _reject) => {
      return this.imageObject.clone((obj: CustomImageBox) => {
        resolve(obj)
      });
    });
    const anyObj = this.applyFilter(clone, filter.type);
    const canvas: HTMLCanvasElement = getScaledImage(anyObj.getElement() as any, 150, 150);
    const blob = await new Promise<any>((resolve, _reject) => {
      return canvas.toBlob(blob => resolve(blob))
    });
    // clear canvas because we only do use the blob file now
    anyObj.dispose();
    const url = this.sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(blob)
    );
    cache.set(hash, url);
    return url;
  }

  private imageHash(url: string, image: ImageFilterType) {
    return url + image;
  }
}
