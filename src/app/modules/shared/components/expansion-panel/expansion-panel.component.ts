import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'app-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss']
})
export class ExpansionPanelComponent {
  @HostBinding('class.expanded')
  @Input()
  collapsed = false;

  constructor() {}
}
