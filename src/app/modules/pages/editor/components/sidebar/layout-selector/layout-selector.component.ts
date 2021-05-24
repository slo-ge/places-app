import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CmsService} from "@app/core/services/cms.service";
import {EMPTY, Observable} from "rxjs";
import {Preset} from "@app/core/model/preset";
import {toAbsoluteCMSUrl} from "@app/core/editor/utils";
import {ActivatedRoute} from "@angular/router";
import {mergeMap} from "rxjs/operators";

@Component({
  selector: 'app-layout-selector',
  templateUrl: './layout-selector.component.html',
  styleUrls: ['./layout-selector.component.scss']
})
export class LayoutSelectorComponent implements OnInit {
  @Output()
  layout = new EventEmitter<Preset>();

  settings$: Observable<Preset[]> = EMPTY;

  constructor(private cmsService: CmsService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.settings$ = this.route.queryParamMap.pipe(
      mergeMap(data => this.cmsService.getLayoutSetting(data.get('presetTag')))
    );
  }

  selectPreset(setting: Preset) {
    this.layout.emit(setting);
  }

  cmsApiUrl(url: string) {
    return toAbsoluteCMSUrl(url)
  }
}
