import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {

  @Input()
  name: 'back' | 'geo-search' | 'sort-latest' | 'italic-burger-menu';

  constructor() { }

  ngOnInit() {
  }

}
