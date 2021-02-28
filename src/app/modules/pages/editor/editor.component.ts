import {Component, OnInit} from '@angular/core';
import {MetaMapperData} from "@app/modules/pages/editor/models";
import {EMPTY, Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {AdapterService} from "@app/core/services/adapters/adapter.service";
import {DownloadCanvasService} from "@app/core/editor/download-canvas.service";


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  setting$: Observable<MetaMapperData> = EMPTY;

  constructor(private adapterService: AdapterService,
              private route: ActivatedRoute,
              private downloadService: DownloadCanvasService) {
  }

  ngOnInit(): void {
    // data is in most cases the url where we can get our meta data from
    const data = this.route.snapshot.queryParamMap.get('data');
    const contentService = this.adapterService.getService(this.route.snapshot.queryParamMap);
    this.setting$ = contentService.getMetaMapperData(data as string);
  }


  /**
   * Generate a downloadable image
   */
  download() {
    this.downloadService.download();
  }
}
