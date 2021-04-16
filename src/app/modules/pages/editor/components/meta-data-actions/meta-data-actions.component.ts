import {Component, Input, OnInit} from '@angular/core';
import {PresetService} from "@app/core/editor/preset.service";
import {MetaMapperData} from "@app/modules/pages/editor/models";
import {LayoutItemType, PresetObject} from "@app/core/model/preset";
import {fabric} from "fabric";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {getMetaField} from "@app/core/editor/fabric-object.utils";

@Component({
  selector: 'app-meta-data-actions',
  templateUrl: './meta-data-actions.component.html',
  styleUrls: ['./meta-data-actions.component.scss']
})
export class MetaDataActionsComponent {
  @Input()
  presetService: PresetService | any;
  @Input()
  metaProperties: MetaMapperData | any;

  LayoutItemType = LayoutItemType;
  plusIcon = faPlus;

  constructor() {
  }

  async addObject(type: LayoutItemType) {
    if (this.presetService && this.metaProperties) {
      const preset: PresetObject = {
        offsetLeft: 20,
        offsetTop: 20,
        fontSize: 20,
        type: type,
        position: 9999
      };

      if (type === LayoutItemType.TITLE || type === LayoutItemType.DESCRIPTION) {
        const text = getMetaField(this.metaProperties, type);
        const obj = await this.presetService.createText(text, preset, 50);
        this.presetService.addObjectToCanvas(obj);
      }

      // TODO: refactor this stuff
      if (type === LayoutItemType.IMAGE || type === LayoutItemType.ICON) {
        const imageUrl = getMetaField(this.metaProperties, type);
        const image = fabric.util.object.clone(await this.presetService.getImage(imageUrl));
        const obj = await this.presetService.createImage(image, 50, preset);
        this.presetService.addObjectToCanvas(obj);
      }
    }
  }

  async imageUpload(e: any) {
    const file = e.target.files[0];
    var reader = new FileReader();
    const self = this;
    reader.onload = async function (file) {

      const image = await self.presetService.getImage(file!.target!.result, false);
      self.presetService.addObjectToCanvas(image);
    };
    reader.readAsDataURL(file);
  }
}
