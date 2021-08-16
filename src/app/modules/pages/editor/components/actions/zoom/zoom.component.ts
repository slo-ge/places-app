import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {faSearch} from "@fortawesome/free-solid-svg-icons/faSearch";

@Component({
  selector: 'app-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.scss']
})
export class ZoomComponent {
  @Output()
  zoomFactor: EventEmitter<number> = new EventEmitter<number>();
  zoomIcon = faSearch;

  constructor() { }

  changeZoom(zoomFactor: number) {
      this.zoomFactor.emit(zoomFactor / 100);
  }
}
