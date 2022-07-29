import {Component, Input, OnInit} from '@angular/core';
import {PresetService} from "@app/core/editor/preset.service";
import {MetaMapperData} from "@app/modules/pages/editor/models";
import {LayoutItemType, PresetObjectStaticImage} from "@app/core/model/preset";
import {fabric} from "fabric";
import {faImages, faPlus} from "@fortawesome/free-solid-svg-icons";
import {getMetaFieldOrStaticField, isImage, isText} from "@app/core/editor/fabric-object.utils";

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
