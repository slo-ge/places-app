import {Component} from '@angular/core';
import {ActiveObjectService, ObjectAction} from "@app/modules/pages/editor/components/actions/action";

@Component({
  selector: 'app-object-size',
  templateUrl: './object-size.component.html',
  styleUrls: ['./object-size.component.scss']
})
export class ObjectSizeComponent extends ObjectAction<any> {
  activeRangeSliderCurrentValue = 50;

  constructor(activeObjectService: ActiveObjectService) {
    super(activeObjectService);
  }

  changeSize(newWidth: number | string) {
    newWidth = Number(newWidth);
    const activeObject = this.activeObject;
    if (this.activeObject.isType('textbox')) {
      activeObject.fontSize = newWidth;
    } else if (this.activeObject.isType('image')) {
      activeObject.scaleToWidth(newWidth);
    } else {
      console.error('changeSize, can not change size of object:', activeObject)
    }
    this.activeObject.canvas?.renderAll();
  }
}

