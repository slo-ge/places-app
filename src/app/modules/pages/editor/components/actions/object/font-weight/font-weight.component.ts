import {Component, HostBinding, HostListener} from '@angular/core';
import {faBold} from "@fortawesome/free-solid-svg-icons";
import {ActiveObjectService, ObjectAction} from "@app/modules/pages/editor/components/actions/action";
import {fabric} from "fabric";

@Component({
  selector: 'app-font-weight',
  templateUrl: './font-weight.component.html',
  styleUrls: ['./font-weight.component.scss']
})
export class FontWeightComponent extends ObjectAction<fabric.Textbox> {
  @HostBinding('class.active')
  get cls() {
    return this.activeObject.fontWeight === 'bold';
  }

  @HostListener('click')
  toggleBold() {
    this.activeObject.set('fontWeight', this.activeObject.fontWeight === 'bold' ? undefined : 'bold');
    this.activeObject.canvas?.renderAll();
  }

  faIcon = faBold;

  constructor(activeObjectService: ActiveObjectService) {
    super(activeObjectService);
  }
}
