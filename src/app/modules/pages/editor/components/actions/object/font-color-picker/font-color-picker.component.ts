import {Component} from '@angular/core';
import {ActiveObjectService, ObjectAction} from "@app/modules/pages/editor/components/actions/action";
import {fabric} from "fabric";

@Component({
  selector: 'app-font-color-picker',
  templateUrl: './font-color-picker.component.html'
})
export class FontColorPickerComponent extends ObjectAction<fabric.Textbox> {
  constructor(activeObjectService: ActiveObjectService) {
    super(activeObjectService);
  }

  changeColor(colorCode: string) {
    this.activeObject.set('fill', colorCode);
    this.activeObject.canvas?.renderAll();
  }
}

