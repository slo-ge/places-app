import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-text-settings',
  templateUrl: './text-settings.component.html',
  styleUrls: ['./text-settings.component.scss']
})
export class TextSettingsComponent {
  @Input()
  textBox: fabric.Textbox | any;

  constructor() {
  }

  changeColor(colorCode: string) {
      this.textBox.set('fill', colorCode);
      this.textBox.canvas.renderAll();
  }
}
