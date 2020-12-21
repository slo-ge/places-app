import {Component, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ObjectDisplayProperties} from "@app/modules/pages/editor/models";
import {fabric} from "fabric";
import {LayoutSetting} from "@app/core/model/layout-setting";
import {EditorService} from "@app/modules/pages/editor/services/editor.service";
import {ApplyCanvasObjectPropertiesService} from "@app/modules/pages/editor/services/apply-canvas-object-properties.service";
import {DownloadCanvasService} from "@app/modules/pages/editor/services/download-canvas.service";
import {faDownload} from "@fortawesome/free-solid-svg-icons";


const DEFAULT_SETTING: LayoutSetting = {
  height: 1600,
  width: 900,
  fontHeadingSizePixel: 90,
  fontTextSizePixel: 40,

  fontLineHeight: '1',
  fontLetterSpacing: '1.1',

  offsetTop: 75,
  offsetSides: 55,
  offsetImageBottom: 40
};

function mergeLayouts(layout: LayoutSetting, defaultLayout = DEFAULT_SETTING) {
  const config = {
    ...DEFAULT_SETTING,
    ...layout,
    fontHeadingSizePixel: layout.fontHeadingSizePixel || defaultLayout.fontHeadingSizePixel,
    fontTextSizePixel: layout.fontTextSizePixel || defaultLayout.fontTextSizePixel
  };
  console.log('Layout', config);
  return config;
}


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnChanges {
  @Input()
  canvasSettings: ObjectDisplayProperties = {} as any;
  layoutSetting: LayoutSetting = {} as any;
  canvas: any;

  downloadIcon = faDownload;

  constructor(private currentComponentElemRef: ElementRef,
              private editorService: EditorService,
              private downloadService: DownloadCanvasService) {
  }

  ngOnChanges(data: SimpleChanges): void {
    this.refreshCanvas();
  }

  setLayout($event: LayoutSetting) {
    this.layoutSetting = $event;
    this.refreshCanvas();
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

  /*@HostListener('document:click', ['$event'])
  deselectListener(event$: any) {
    if (!this.currentComponentElemRef.nativeElement.contains(event?.target)) {
      this.canvas.discardActiveObject().renderAll();
    }
  }*/

  download() {
    this.downloadService.download();
  }
}
