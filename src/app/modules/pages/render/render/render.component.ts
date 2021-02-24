import {Component, OnInit} from '@angular/core';
import {AdapterService} from "@app/core/services/adapters/adapter.service";
import {ActivatedRoute} from "@angular/router";
import {fabric} from "fabric";
import {PresetService} from "@app/core/editor/preset.service";

@Component({
  selector: 'app-render',
  templateUrl: './render.component.html',
  styleUrls: ['./render.component.scss']
})
export class RenderComponent implements OnInit {
  constructor(private adapterService: AdapterService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    // data is in most cases the url where we can get our meta data from
    const data = this.route.snapshot.queryParamMap.get('data');
    const contentService = this.adapterService.getService(this.route.snapshot.queryParamMap);
    const metaProperties$ = contentService.getEditorPreviewSettings(data as string);

    const preset = this.route.snapshot.data.preset;
    const canvas = new fabric.Canvas('meta-mapper-canvas');

    metaProperties$.subscribe(
      metaData => {
        const presetService = new PresetService(
          canvas,
          metaData,
          preset
        );
        canvas.setHeight(preset.height);
        canvas.setWidth(preset.width);
        canvas.renderAll();
        presetService.initObjectsOnCanvas();
      }
    );
  }
}
