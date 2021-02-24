import {Component, HostBinding, HostListener, Input, OnInit} from '@angular/core';
import {CustomTextBox} from "@app/core/editor/fabric-object.utils";
import {faBold} from "@fortawesome/free-solid-svg-icons/faBold";

@Component({
  selector: 'app-font-weight',
  templateUrl: './font-weight.component.html',
  styleUrls: ['./font-weight.component.scss']
})
export class FontWeightComponent{
  @Input()
  activeObject: CustomTextBox | any;

  faIcon = faBold;

  constructor() {
  }

  @HostBinding('class.bold')
  get cls(){
    return this.activeObject.fontWeight === 'bold';
  }

  @HostListener('click')
  toggleBold() {
    if (this.activeObject.fontWeight === 'bold') {
      this.activeObject.set('fontWeight', null);
    } else {
      this.activeObject.set('fontWeight', 'bold');
    }
    this.activeObject.canvas.renderAll();
  }
}
