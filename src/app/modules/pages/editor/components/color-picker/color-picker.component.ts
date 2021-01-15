import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {
  @Output()
  color: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  addColor(input: HTMLInputElement) {
    console.log(input.value);
    this.color.emit(input.value);
  }
}
