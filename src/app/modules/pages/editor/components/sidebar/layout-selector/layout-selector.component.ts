import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CmsService} from "@app/core/services/cms.service";
import {EMPTY, Observable} from "rxjs";
import {Preset} from "@app/core/model/preset";
import {toAbsoluteCMSUrl} from "@app/core/editor/utils";
import {ActionType, GoogleAnalyticsService} from "@app/core/services/google-analytics.service";

@Component({
  selector: 'app-layout-selector',
  templateUrl: './layout-selector.component.html',
  styleUrls: ['./layout-selector.component.scss']
})
export class LayoutSelectorComponent implements OnInit {
  @Output()
  layout = new EventEmitter<Preset>();

  settings$: Observable<Preset[]> = EMPTY;

  constructor(private cmsService: CmsService, private ga: GoogleAnalyticsService) {
  }

  ngOnInit(): void {
    this.settings$ = this.cmsService.getLayoutSetting();
  }

  selectPreset(setting: Preset) {
    this.ga.triggerClick(ActionType.CLICK_CHANGE_PRESET, setting.title || 'no-title');
    this.layout.emit(setting);
  }

  cmsApiUrl(url: string) {
    return toAbsoluteCMSUrl(url)
  }
}
