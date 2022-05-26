import {Component, HostBinding, HostListener} from '@angular/core';
import {CustomTextBox} from "@app/core/editor/fabric-object.utils";
import {faUnderline} from "@fortawesome/free-solid-svg-icons";
import {ActiveObjectService, ObjectAction} from "@app/modules/pages/editor/components/actions/action";

@Component({
  selector: 'app-font-underline',
  templateUrl: './font-underline.component.html',
  styleUrls: ['./font-underline.component.scss']
})
export class FontUnderlineComponent extends ObjectAction<CustomTextBox>{
  faIcon = faUnderline;

  constructor(activeObjectService: ActiveObjectService) {
    super(activeObjectService);
  }

  @HostBinding('class.active')
  get cls() {
    return this.activeObject.underline;
  }

  @HostListener('click')
  toggleUnderline() {
    this.activeObject.set('underline', this.activeObject.underline ? undefined : true);
    this.activeObject.canvas?.renderAll();
  }
}
