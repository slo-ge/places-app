import {Component, HostBinding, HostListener, Input} from '@angular/core';
import {CustomTextBox} from "@app/core/editor/fabric-object.utils";
import {faBold} from "@fortawesome/free-solid-svg-icons/faBold";

@Component({
  selector: 'app-font-weight',
  templateUrl: './font-weight.component.html',
  styleUrls: ['./font-weight.component.scss']
})
export class FontWeightComponent {
  @Input()
  activeObject: CustomTextBox | any;

  faIcon = faBold;

  constructor() {
  }

  @HostBinding('class.bold')
  get cls() {
    return this.activeObject.fontWeight === 'bold';
  }

  @HostListener('click')
  toggleBold() {
    this.activeObject.set('fontWeight', this.activeObject.fontWeight === 'bold' ? null : 'bold');
    this.activeObject.canvas.renderAll();
  }
}
