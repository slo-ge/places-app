import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent {
  @Output()
  color: EventEmitter<string> = new EventEmitter<string>();
  @Input()
  currentColor: string | undefined = '';
  @Input()
  name: string = 'Color';

  constructor() { }

  addColor(input: HTMLInputElement) {
    this.color.emit(input.value);
  }
}
