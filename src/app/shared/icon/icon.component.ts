import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent {

  @Input()
  name: 'back'
      | 'geo-search'
      | 'sort-latest'
      | 'italic-burger-menu'
      | 'whatsapp'
      | 'telegram'
      | 'yummy'
      | 'search'
      | 'www';

  constructor() { }
}
