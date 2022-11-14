import {Component, EventEmitter, Input, Output} from '@angular/core';
import {faSearch} from "@fortawesome/free-solid-svg-icons";


@Component({
  selector: 'app-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.scss']
})
export class ZoomComponent {
  @Input()
  zoomFactor!: number;

  @Output()
  zoomFactorChange: EventEmitter<number> = new EventEmitter<number>();

  zoomIcon = faSearch;

  constructor() {
  }

  changeZoom(zoomFactor: number) {
    const zoom = zoomFactor - 50;
    this.zoomFactorChange.emit( this.zoomFactor * (1 + zoom/100));
  }
}
