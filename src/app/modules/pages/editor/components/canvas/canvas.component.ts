import {Component, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ObjectDisplayProperties} from "@app/modules/pages/editor/models";
import {fabric} from "fabric";
import {ExportLatestPreset, LayoutItemType} from "@app/core/model/export-latest-preset";
import {EditorService} from "@app/modules/pages/editor/services/editor.service";
import {ApplyCanvasObjectPropertiesService} from "@app/modules/pages/editor/services/apply-canvas-object-properties.service";
import {DownloadCanvasService} from "@app/modules/pages/editor/services/download-canvas.service";
import {faDownload} from "@fortawesome/free-solid-svg-icons";


const DEFAULT_SETTING: ExportLatestPreset = {
  height: 900,
  width: 900,
  items: [
    {
      type: LayoutItemType.TITLE,
      offsetTop: 30,
      offsetLeft: 30,
      fontSize: 50,
      fontWeight: 'bold'
    }
  ]
};

function mergeLayouts(layout: ExportLatestPreset, defaultLayout = DEFAULT_SETTING) {
  return {
    ...defaultLayout,
    ...layout,
  };
}


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnChanges {
  @Input()
  canvasSettings: ObjectDisplayProperties = {} as any;
  layoutSetting: ExportLatestPreset = {} as any;
  canvas: any;

  downloadIcon = faDownload;

  constructor(private currentComponentElemRef: ElementRef,
              private editorService: EditorService,
              private downloadService: DownloadCanvasService) {
  }

  ngOnChanges(data: SimpleChanges): void {
    this.refreshCanvas();
  }

  setLayout($event: ExportLatestPreset) {
    this.layoutSetting = $event;
    this.refreshCanvas();
    console.log('layout selected');
  }

  refreshCanvas() {
    if (this.canvas == null) {
      this.canvas = new fabric.Canvas('myCanvas');
      this.editorService.setCanvas(this.canvas);
    } else {
      this.canvas.clear();
    }

    this.layoutSetting = mergeLayouts(this.layoutSetting);

    if (this.canvasSettings) {
      const applyObjectService = new ApplyCanvasObjectPropertiesService(
        this.canvas,
        this.canvasSettings,
        this.layoutSetting
      );

      this.canvas.setHeight(this.layoutSetting.height);
      this.canvas.setWidth(this.layoutSetting.width);
      this.canvas.renderAll();

      applyObjectService.initObjectsOnCanvas();
    }
  }

  download() {
    this.downloadService.download();
  }
}
