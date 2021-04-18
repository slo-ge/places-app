import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-font-background',
  templateUrl: './font-background.component.html',
  styleUrls: ['./font-background.component.scss']
})
export class FontBackgroundComponent {
  @Input()
  textBox: fabric.Textbox | any;

  constructor() {
  }

  changeColor(colorCode: string) {
    this.textBox.set('backgroundColor', colorCode);
    this.textBox.canvas.renderAll();
  }

  removeColor() {
    this.textBox.set('backgroundColor', null);
    this.textBox.set('padding', null);
    this.textBox.canvas.renderAll();
  }

  changeSize($event: number) {
    this.textBox.set('padding', $event);
    this.textBox.canvas.renderAll();
  }
}
