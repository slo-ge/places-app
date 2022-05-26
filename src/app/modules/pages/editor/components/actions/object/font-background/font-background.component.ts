import {Component} from '@angular/core';
import {ActiveObjectService, ObjectAction} from "@app/modules/pages/editor/components/actions/action";
import {fabric} from "fabric";

@Component({
  selector: 'app-font-background',
  templateUrl: './font-background.component.html',
  styleUrls: ['./font-background.component.scss']
})
export class FontBackgroundComponent extends ObjectAction<fabric.Textbox> {
  constructor(activeObjectService: ActiveObjectService) {
    super(activeObjectService);
  }

  changeColor(colorCode: string) {
    this.activeObject.set('backgroundColor', colorCode);
    this.activeObject.canvas?.renderAll();
  }

  removeColor() {
    this.activeObject.set('backgroundColor', undefined);
    this.activeObject.set('padding', undefined);
    this.activeObject.canvas?.renderAll();
  }

  changeSize($event: number) {
    this.activeObject.set('padding', $event);
    this.activeObject.canvas?.renderAll();
  }
}
