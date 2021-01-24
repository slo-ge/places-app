import {Component, Input, OnInit} from '@angular/core';
import {PresetService} from "@app/modules/pages/editor/services/preset.service";
import {MetaProperties} from "@app/modules/pages/editor/models";
import {LayoutItemType, PresetObject} from "@app/core/model/preset";
import {fabric} from "fabric";
import {faArrowDown, faPlus} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-meta-data-actions',
  templateUrl: './meta-data-actions.component.html',
  styleUrls: ['./meta-data-actions.component.scss']
})
export class MetaDataActionsComponent implements OnInit {
  @Input()
  presetService: PresetService | any;
  @Input()
  metaProperties: MetaProperties | any;

  LayoutItemType = LayoutItemType;
  arrowDown = faArrowDown;
  plusIcon = faPlus;
  constructor() {
  }

  ngOnInit(): void {
  }

  async addText(type: LayoutItemType) {
    if (this.presetService && this.metaProperties) {
      const preset: PresetObject = {
        offsetLeft: 20,
        offsetTop: 20,
        fontSize: 20,
        type: type,
        position: 9999
      };
      if (type === LayoutItemType.TITLE || type === LayoutItemType.DESCRIPTION) {
        const text = type === LayoutItemType.TITLE
          ? this.metaProperties.title
          : this.metaProperties.description;

        const obj = this.presetService.createText(text, preset, 50);
        this.presetService.addObjectToCanvas(obj);
      }

      // TODO: refactor this stuff
      if (type === LayoutItemType.IMAGE) {
        const image = fabric.util.object.clone(await this.presetService.getImage());
        const obj = this.presetService.createImage(image, 50, preset);
        this.presetService.addObjectToCanvas(obj);
      }
    }
  }
}
