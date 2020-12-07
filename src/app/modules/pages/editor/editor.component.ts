import {Component, OnInit} from '@angular/core';
import {SimplePreviewCanvasSetting} from "@app/modules/pages/editor/models";
import {EMPTY, Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {AdapterService} from "@app/core/services/adapter.service";
import {LayoutSetting} from "@app/core/model/layout-setting";


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  canvas: any;
  setting$: Observable<SimplePreviewCanvasSetting> = EMPTY;
  layout: LayoutSetting = {} as any;

  constructor(private adapterService: AdapterService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const data = this.route.snapshot.queryParamMap.get('data');
    const contentService = this.adapterService.getService(this.route.snapshot.queryParamMap);
    // TODO: guess data
    this.setting$ = contentService.getEditorPreviewSettings(data as string);
  }

  setLayout($event: LayoutSetting) {
    this.layout = $event;
  }
}
