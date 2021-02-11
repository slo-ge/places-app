import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CmsService} from "@app/core/services/cms.service";
import {EMPTY, Observable} from "rxjs";
import {Preset} from "@app/core/model/preset";
import {toAbsoluteCMSUrl} from "@app/modules/pages/editor/services/utils";

@Component({
  selector: 'app-layout-selector',
  templateUrl: './layout-selector.component.html',
  styleUrls: ['./layout-selector.component.scss']
})
export class LayoutSelectorComponent implements OnInit {
  @Output()
  layout = new EventEmitter<Preset>();

  settings$: Observable<Preset[]> = EMPTY;

  constructor(private cmsService: CmsService) {
  }

  ngOnInit(): void {
    this.settings$ = this.cmsService.getLayoutSetting();
  }

  selectPreset(setting: Preset) {
    this.layout.emit(setting);
  }

  cmsApiUrl(url: string) {
    return toAbsoluteCMSUrl(url)
  }
}
