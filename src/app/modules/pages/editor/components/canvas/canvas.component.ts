import {Component, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ObjectDisplayProperties} from "@app/modules/pages/editor/models";
import {fabric} from "fabric";
import {LayoutItemType, Preset} from "@app/core/model/preset";
import {EditorService} from "@app/modules/pages/editor/services/editor.service";
import {PresetService} from "@app/modules/pages/editor/services/preset.service";
import {DownloadCanvasService} from "@app/modules/pages/editor/services/download-canvas.service";
import {faDownload, faSave} from "@fortawesome/free-solid-svg-icons";
import {CmsService} from "@app/core/services/cms.service";


const DEFAULT_SETTING: Preset = {
  height: 900,
  width: 900,
  items: [
    {
      type: LayoutItemType.TITLE,
      offsetTop: 30,
      offsetLeft: 30,
      fontSize: 50,
      fontWeight: 'bold',
      position: 1
    }
  ]
};

function mergeLayouts(layout: Preset, defaultLayout = DEFAULT_SETTING) {
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
  layoutSetting: Preset = {} as any;
  canvas: any;
  currentPresetService: PresetService | null = null;

  downloadIcon = faDownload;
  saveChangesIcon = faSave;

  constructor(private currentComponentElemRef: ElementRef,
              private editorService: EditorService,
              private downloadService: DownloadCanvasService,
              private cmsService: CmsService) {
  }

  ngOnChanges(data: SimpleChanges): void {
    this.refreshCanvas();
  }

  setLayout($event: Preset) {
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
      this.currentPresetService = new PresetService(
        this.canvas,
        this.canvasSettings,
        this.layoutSetting
      );

      this.canvas.setHeight(this.layoutSetting.height);
      this.canvas.setWidth(this.layoutSetting.width);
      this.canvas.renderAll();

      this.currentPresetService.initObjectsOnCanvas();
    }
  }

  download() {
    this.downloadService.download();
  }

  updateValues() {
    if (this.currentPresetService) {
      this.cmsService.update(this.currentPresetService.getCurrentItems());
    }
  }
}
