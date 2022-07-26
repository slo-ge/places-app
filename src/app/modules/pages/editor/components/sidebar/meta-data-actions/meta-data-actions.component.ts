import {Component, Input, OnInit} from '@angular/core';
import {PresetService} from "@app/core/editor/preset.service";
import {MetaMapperData} from "@app/modules/pages/editor/models";
import {LayoutItemType, PresetObjectStaticImage} from "@app/core/model/preset";
import {fabric} from "fabric";
import {faImages, faPlus} from "@fortawesome/free-solid-svg-icons";
import {getMetaFieldOrStaticField, isImage, isText} from "@app/core/editor/fabric-object.utils";
import {OverlayMenuComponent} from "@app/modules/shared/components/overlay-menu/overlay-menu.component";

@Component({
  selector: 'app-meta-data-actions',
  templateUrl: './meta-data-actions.component.html',
  styleUrls: ['./meta-data-actions.component.scss']
})
export class MetaDataActionsComponent {
  @Input()
  presetService!: PresetService;
  @Input()
  metaProperties!: MetaMapperData;

  LayoutItemType = LayoutItemType;
  plusIcon = faPlus;
  imageIcon = faImages;
  showMedia = false;

  // other images will be selected via dialog
  selectedFromOthers: string[] = [];

  constructor() {
  }

  async addObject(type: LayoutItemType) {
    if (this.presetService && this.metaProperties) {
      const preset = MetaDataActionsComponent.getDefaultPresetObject(type);
      const textOrImage = getMetaFieldOrStaticField(this.metaProperties, preset);
      if (isText(type)) {
        const obj = await this.presetService.createText(textOrImage, preset, 50);
        this.presetService.addObjectToCanvas(obj, true);
      } else if (isImage(type)) {
        const image = fabric.util.object.clone(await this.presetService.getImage(textOrImage));
        const obj = await this.presetService.createImage(image, 50, preset);
        this.presetService.addObjectToCanvas(obj, true);
      }
    }
  }

  async addImageFromFile(e: any) {
    const file = e.target.files[0];
    const reader = new FileReader();
    const self = this;
    reader.onload = async function (file) {
      const image = await self.presetService.getImage(file!.target!.result as any, false);
      if (image) {
        image.set({'left': 50});
        image.set({'top': 50});
        image.scaleToWidth(self.presetService.canvas.getWidth() / 2);
        self.presetService.addObjectToCanvas(image, true);
      }
    };
    reader.readAsDataURL(file);
  }

  async addStaticImage(url: string) {
    const preset: PresetObjectStaticImage = {
      ...MetaDataActionsComponent.getDefaultPresetObject(LayoutItemType.STATIC_IMAGE),
      image: {url}
    };
    const image = fabric.util.object.clone(await this.presetService.getImage(url));
    const obj = this.presetService.createImage(image, 50, preset);
    this.presetService.addObjectToCanvas(obj, true);
  }

  /**
   * Adds one or more images
   *
   * TODO: build better grids, layouts...
   * @param overlay
   */
  async addSelected(overlay: OverlayMenuComponent) {
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
      if (index % 3 === 0) {
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
    overlay.close();
  }


  private static getDefaultPresetObject(type: LayoutItemType): any {
    return {
      offsetLeft: 20,
      offsetTop: 20,
      fontSize: 40,
      type,
      position: 9999
    }
  }
}
