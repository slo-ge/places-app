import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {CustomTextBox} from "@app/core/editor/fabric-object.utils";
import {importFontInDom} from "@app/core/editor/utils";
import * as FontFaceObserver from "fontfaceobserver";
import {Font, FONTS} from "@app/core/model/preset";


@Component({
  selector: 'app-font-selector',
  templateUrl: './font-selector.component.html',
  styleUrls: ['./font-selector.component.scss']
})
export class FontSelectorComponent implements OnInit {
  layoutSelectForm = this.fb.group({
    fontFamily: ['',],
  });

  @Input()
  activeObject: CustomTextBox | any;

  fonts = FONTS;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.layoutSelectForm?.get('fontFamily')?.valueChanges.subscribe(value => this.addFont(value));
  }

  /**
   * async loads the font and sets it to textbox
   * @param font
   */
  async addFont(font: Font) {
    if (!font) {
      return;
    }
    const fontObserver = new FontFaceObserver(font.fontName);
    importFontInDom(font);
    await fontObserver.load(font.fontFamily, 5000);
    this.activeObject.set('fontFamily', font.fontFamily);
    this.activeObject.canvas.renderAll();
    this.activeObject.presetFont = font;
  }
}
