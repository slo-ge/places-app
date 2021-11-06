import {Component, Input} from '@angular/core';
import {PresetService} from "@app/core/editor/preset.service";
import {MetaMapperData} from "@app/modules/pages/editor/models";
import {LayoutItemType, PresetObject, PresetObjectStaticImage} from "@app/core/model/preset";
import {fabric} from "fabric";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {getMetaFieldOrStaticField, isImage, isText} from "@app/core/editor/fabric-object.utils";

@Component({
  selector: 'app-meta-data-actions',
  templateUrl: './meta-data-actions.component.html',
  styleUrls: ['./meta-data-actions.component.scss']
})
export class MetaDataActionsComponent {
  @Input()
  presetService: PresetService | any;
  @Input()
  metaProperties: MetaMapperData = {} as any;


  LayoutItemType = LayoutItemType;
  plusIcon = faPlus;
  showMedia = false; // Initially do not show the media elements

  constructor() {
  }

  async addObject(type: LayoutItemType) {
    if (this.presetService && this.metaProperties) {
      const preset: PresetObject = {
        offsetLeft: 20,
        offsetTop: 20,
        fontSize: 40,
        type: type,
        position: 9999
      };

      if (isText(type)) {
        const text = getMetaFieldOrStaticField(this.metaProperties, preset);
        const obj = await this.presetService.createText(text, preset, 50);
        this.presetService.addObjectToCanvas(obj);
      }

      // TODO: refactor this stuff
      if (isImage(type)) {
        const imageUrl = getMetaFieldOrStaticField(this.metaProperties, preset);
        const image = fabric.util.object.clone(await this.presetService.getImage(imageUrl));
        const obj = await this.presetService.createImage(image, 50, preset);
        this.presetService.addObjectToCanvas(obj);
      }
    }
  }

  /**
   * TODO: refactore to Service
   * @param e
   */
  async imageUpload(e: any) {
    const file = e.target.files[0];
    const reader = new FileReader();
    const self = this;
    reader.onload = async function (file) {

      const image = await self.presetService.getImage(file!.target!.result, false);
      image.set({'left': 50});
      image.set({'top': 50});
      image.scaleToWidth(self.presetService.canvas.getWidth() / 2);
      self.presetService.addObjectToCanvas(image);
    };
    reader.readAsDataURL(file);
  }

  async addStaticImage(url: string) {
    const preset: PresetObjectStaticImage = {
      offsetLeft: 20,
      offsetTop: 20,
      fontSize: 40,
      type: LayoutItemType.STATIC_IMAGE,
      position: 9999,
      image: {
        url
      }
    };
    const image = fabric.util.object.clone(await this.presetService.getImage(url));
    const obj = await this.presetService.createImage(image, 50, preset);
    this.presetService.addObjectToCanvas(obj);
  }
}
