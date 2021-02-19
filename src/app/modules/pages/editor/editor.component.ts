import {Component, OnInit} from '@angular/core';
import {MetaProperties} from "@app/modules/pages/editor/models";
import {EMPTY, Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {AdapterService} from "@app/core/services/adapters/adapter.service";
import {DownloadCanvasService} from "@app/modules/pages/editor/services/download-canvas.service";


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  setting$: Observable<MetaProperties> = EMPTY;

  constructor(private adapterService: AdapterService,
              private route: ActivatedRoute,
              private downloadService: DownloadCanvasService) {
  }

  ngOnInit(): void {
    const data = this.route.snapshot.queryParamMap.get('data');
    const contentService = this.adapterService.getService(this.route.snapshot.queryParamMap);
    // TODO: guess data
    this.setting$ = contentService.getEditorPreviewSettings(data as string);
  }


  /**
   * Generate a downloadable image
   */
  download() {
    this.downloadService.download();
  }

}
