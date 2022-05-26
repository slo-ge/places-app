import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {CustomTextBox} from "@app/core/editor/fabric-object.utils";
import {importFontInDom} from "@app/core/editor/utils";
import * as FontFaceObserver from "fontfaceobserver";
import {Font} from "@app/core/model/preset";
import {CmsService} from "@app/core/services/cms.service";
import {EMPTY, Observable, of} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {FALLBACK_FONTS} from "@app/core/utils/fallback";
import {ActiveObjectService, ObjectAction} from "@app/modules/pages/editor/components/actions/action";


@Component({
  selector: 'app-font-selector',
  templateUrl: './font-selector.component.html'
})
export class FontSelectorComponent extends ObjectAction<CustomTextBox> implements OnInit {
  layoutSelectForm = this.fb.group({
    fontFamily: ['',],
  });

  alphaSort = (a: Font, b: Font) => (a.fontName > b.fontName) ? 1 : -1;
  fonts$: Observable<Font[]> = EMPTY;

  constructor(private fb: FormBuilder,
              private cms: CmsService,
              activeObjectService: ActiveObjectService) {
    super(activeObjectService);
  }

  ngOnInit(): void {
    this.layoutSelectForm?.get('fontFamily')?.valueChanges.subscribe(value => this.addFont(value));
    this.fonts$ = this.cms.getSettings().pipe(
      map(settings => settings.GoogleFonts.sort(this.alphaSort)),
      catchError(e => {
        console.error(e);
        return of(FALLBACK_FONTS.sort(this.alphaSort));
      })
    );
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
    this.activeObject.canvas?.renderAll();
    this.activeObject.presetFont = font;
  }
}
