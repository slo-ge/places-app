import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LayoutSettingService} from "@app/core/services/layout-setting.service";
import {EMPTY, Observable} from "rxjs";
import {ExportLatestPresetObject, ExportLatestPreset} from "@app/core/model/export-latest-preset";
import {FormArray, FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-layout-selector',
  templateUrl: './layout-selector.component.html',
  styleUrls: ['./layout-selector.component.scss']
})
export class LayoutSelectorComponent implements OnInit {
  @Output()
  layout = new EventEmitter<ExportLatestPreset>();

  settings$: Observable<ExportLatestPreset[]> = EMPTY;
  showLayout = false;

  layoutSelectForm = this.fb.group({
    layoutName: ['',],
  });

  detailForm = this.fb.group({
    width: ['',],
    height: ['',],
    title: ['',],
    fontHeadingSizePixel: ['',],
    fontTextSizePixel: ['',],
    fontFamilyHeadingCSS: ['',],
    fontFamilyTextCSS: ['',],

    fontLineHeight: ['',],
    fontLetterSpacing: ['',],

    offsetTop: ['',],
    offsetSides: ['',],
    offsetImageBottom: ['',],
    items: this.fb.array([])
  });


  constructor(private layoutSettingsService: LayoutSettingService,
              public fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.settings$ = this.layoutSettingsService.getLayoutSetting();

    this.detailForm.valueChanges.subscribe(() => this.updateValues());
  }

  /**
   * After selecting an preset this method will be called
   * Also fills all forms with values from preset
   *
   * @param _event
   */
  changeLayoutSetting(_event?: Event) {
    this.layout.emit(this.layoutSelectForm.value['layoutName']);
    this.detailForm.patchValue({...this.layoutSelectForm.value['layoutName']});
    const values = this.layoutSelectForm.value['layoutName'];
    const items = this.detailForm.get('items') as FormArray;

    for (let item of values.items) {
      items?.push(this.createItems(item));
    }
  }

  layoutToggle() {
    this.showLayout = !this.showLayout;
  }

  updateValues() {
    const tempLayout = this.layoutSelectForm.value['layoutName'] || {};
    this.layout.emit({...tempLayout, ...this.detailForm.value})
  }

  get itemsForm() {
    return (this.detailForm.get('items') as FormArray).controls;
  }

  createItems(item: ExportLatestPresetObject) {
    return this.fb.group({
      fontSize: [item.fontSize],
      fontLineHeight: [item.fontLineHeight,],
      fontLetterSpacing: [item.fontLetterSpacing,],

      offsetTop: [item.offsetTop,],
      offsetLeft: [item.offsetLeft,],

      type: [item.type,],
      title: [item.title,],
      position: [item.position],
      fontWeight: [item.fontWeight]
    });
  }
}
