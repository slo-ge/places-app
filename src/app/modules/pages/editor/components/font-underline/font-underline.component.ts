import {Component, HostBinding, HostListener, Input} from '@angular/core';
import {CustomTextBox} from "@app/core/editor/fabric-object.utils";
import {faUnderline} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-font-underline',
  templateUrl: './font-underline.component.html',
  styleUrls: ['./font-underline.component.scss']
})
export class FontUnderlineComponent {
  @Input()
  activeObject: CustomTextBox | any;

  faIcon = faUnderline;

  constructor() {
  }

  @HostBinding('class.active')
  get cls() {
    return this.activeObject.underline;
  }

  @HostListener('click')
  toggleUnderline() {
    this.activeObject.set('underline', this.activeObject.underline ? null : true);
    this.activeObject.canvas.renderAll();
  }
}
