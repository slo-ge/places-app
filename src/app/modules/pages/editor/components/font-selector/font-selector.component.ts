import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {CustomTextBox} from "@app/modules/pages/editor/services/fabric-object.utils";
import {importFontInDom} from "@app/modules/pages/editor/services/utils";
import * as FontFaceObserver from "fontfaceobserver";

export interface Font {
  importPath: string;
  fontFamily: string;
  fontName: string;
}

const FONTS: Font[] = [
  {
    fontFamily: "'Montserrat', sans-serif",
    importPath: 'https://fonts.googleapis.com/css2?family=Montserrat&display=swap',
    fontName: 'Montserrat'
  },
  {
    fontFamily: "'Noto Serif', serif",
    importPath: 'https://fonts.googleapis.com/css2?family=Montserrat&family=Noto+Serif&display=swap',
    fontName: 'Noto Serif'
  },
  {
    fontFamily: '"Archivo Black", sans-serif',
    importPath: 'https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap',
    fontName: 'Archivo Black'
  },
  {
    fontFamily: "'Fraunces', serif",
    importPath: 'https://fonts.googleapis.com/css2?family=Fraunces&display=swap',
    fontName: 'Fraunces'
  }
];

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

  FONTS = FONTS;

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
    if(!font) {
      return;
    }
    const fontObserver = new FontFaceObserver(font.fontName);
    importFontInDom(font);
    await fontObserver.load(font.fontFamily, 5000);
    console.log('loaded font', font);
    this.activeObject.set('fontFamily', font.fontFamily);
    this.activeObject.canvas.renderAll();
  }
}
