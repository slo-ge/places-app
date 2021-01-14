import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LayoutSettingService} from "@app/core/services/layout-setting.service";
import {EMPTY, Observable} from "rxjs";
import {PresetObject, Preset} from "@app/core/model/preset";
import {FormArray, FormBuilder} from "@angular/forms";
import {cmsApiUrl} from "@app/modules/pages/editor/services/preset.service";

@Component({
  selector: 'app-layout-selector',
  templateUrl: './layout-selector.component.html',
  styleUrls: ['./layout-selector.component.scss']
})
export class LayoutSelectorComponent implements OnInit {
  @Output()
  layout = new EventEmitter<Preset>();

  settings$: Observable<Preset[]> = EMPTY;
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

    // TODO: this can not be used, because the filling the inner
    // TODO: form leads to trigger the subscription multiple times
    //this.detailForm.valueChanges.subscribe(() => this.updateValues());
  }

  /**
   * After selecting an preset this method will be called
   * Also fills all forms with values from preset
   *
   * @param _event
   * @param preset
   */
  changeLayoutSetting(_event?: Event, preset = this.layoutSelectForm.value['layoutName']) {
    this.layout.emit(preset);
    this.detailForm.patchValue({...preset});
    const items = this.detailForm.get('items') as FormArray;
    items.clear();
    for (let item of preset.items) {
      // triggers multiple valueChanges
      items?.push(this.createItems(item));
    }
  }

  selectPreset(setting: Preset) {
    this.changeLayoutSetting({} as any, setting)
  }

  layoutToggle() {
    this.showLayout = !this.showLayout;
  }

  updateValues() {
    const tempLayout = this.layoutSelectForm.value['layoutName'] || {};
    this.layout.emit({...this.detailForm.value, ...tempLayout });
  }

  get itemsForm() {
    return (this.detailForm.get('items') as FormArray).controls;
  }

  createItems(item: PresetObject) {
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

  cmsApiUrl(url: string) {
    return cmsApiUrl(url)
  }
}
