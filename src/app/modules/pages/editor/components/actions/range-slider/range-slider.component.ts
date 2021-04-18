import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss']
})
export class RangeSliderComponent {
  @Input()
  min = 0;
  @Input()
  max = 100;
  @Input()
  value = 50;

  @Output()
  valueChange = new EventEmitter<number>();

  constructor() { }

  valueChanged(value: string) {
    this.value = Number(value);
    this.valueChange.emit(Number(value));
  }
}
