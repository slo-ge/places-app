import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LayoutSettingService} from "@app/core/services/layout-setting.service";
import {EMPTY, Observable} from "rxjs";
import {LayoutSetting} from "@app/core/model/layout-setting";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-layout-selector',
  templateUrl: './layout-selector.component.html',
  styleUrls: ['./layout-selector.component.scss']
})
export class LayoutSelectorComponent implements OnInit {
  @Output()
  layout = new EventEmitter<LayoutSetting>();

  settings$: Observable<LayoutSetting[]> = EMPTY;
  showLayout = false;

  layoutSelectForm = this.fb.group({
    layoutName: ['',]
  });


  constructor(private layoutSettingsService: LayoutSettingService,
              public fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.settings$ = this.layoutSettingsService.getLayoutSetting();
  }

  changeLayoutSetting($event: Event) {
    this.layout.emit(this.layoutSelectForm.value['layoutName']);
  }

  layoutToggle() {
    console.log(this.layout);
    this.showLayout = !this.showLayout;
  }
}
