import {Component, Input} from '@angular/core';
import {fabric} from "fabric";
import {PresetService} from "@app/core/editor/preset.service";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-multi-image',
  templateUrl: './multi-image.component.html',
  styleUrls: ['./multi-image.component.scss']
})
export class MultiImageComponent {
  @Input()
  presetService!: PresetService;
  @Input()
  images!: string[];

  // other images will be selected via dialog
  selectedFromOthers: string[] = [];

  plusIcon = faPlus;

  constructor() {
  }


  /**
   * Adds one or more images
   */
  async addSelected(rows=3) {
    const fabricObjects: fabric.Object[] = [];
    let old: any = null;
    let top = 200;
    let left = 20;
    for (const [index, src] of this.selectedFromOthers.entries()) {
      let image = fabric.util.object.clone(await this.presetService.getImage(src));
      image.scaleToHeight(200);
      const scaling = image.getObjectScaling();
      image.height = image.getScaledHeight() / scaling.scaleX;
      image.width = image.getScaledWidth() / scaling.scaleY;

      // Build grid 3xn grid
      if (index % rows === 0) {
        top = top + 200 + 20;
        left = 20;
      } else {
        left = old ? old.left + old.getScaledWidth() + 20 : 20;
      }

      image.left = left;
      image.top = top;
      fabricObjects.push(image);
      old = image;
    }
    this.presetService.canvas.add(...fabricObjects);

    // select all new added images
    const selection = new fabric.ActiveSelection(fabricObjects, {canvas: this.presetService.canvas});
    this.presetService.canvas.setActiveObject(selection);

    // render and close modal
    this.presetService.canvas.renderAll();
  }

  updateSelection(src: string) {
    if (this.selectedFromOthers.includes(src)) {
      this.selectedFromOthers = this.selectedFromOthers.filter(i => i !== src);
    } else {
      this.selectedFromOthers.push(src)
    }
  }
}
