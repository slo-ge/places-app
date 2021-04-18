import { Component, Input } from '@angular/core';
import {IconProp} from "@fortawesome/fontawesome-svg-core";

@Component({
  selector: 'tab',
  styleUrls: ['./tab.component.scss'],
  template: `
    <div [hidden]="!active" class="pane" [class.active]="active">
      <ng-content></ng-content>
    </div>
  `
})
export class TabComponent {
  @Input('tabTitle') title: string = '';
  @Input() faIcon: IconProp | null = null;
  @Input() active = false;
}
