import {Component, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ObjectDisplayProperties} from "@app/modules/pages/editor/models";
import {fabric} from "fabric";
import {LayoutItemType, Preset, PresetObject} from "@app/core/model/preset";
import {EditorService} from "@app/modules/pages/editor/services/editor.service";
import {PresetService} from "@app/modules/pages/editor/services/preset.service";
import {DownloadCanvasService} from "@app/modules/pages/editor/services/download-canvas.service";
import {faDownload, faSave} from "@fortawesome/free-solid-svg-icons";
import {AuthResponse, CmsService} from "@app/core/services/cms.service";
import {getPresetItem} from "@app/modules/pages/editor/services/fabric-object.utils";
import {EMPTY, Observable} from "rxjs";


const DEFAULT_SETTING: Preset = {
  id: 9999,
  height: 900,
  width: 900,
  itemsJson: [
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

const DEFAULT_ITEMS: PresetObject[]  = [
  {
    "offsetTop": 120,
    "position": 1,
    "fontLineHeight": "1",
    "fontLetterSpacing": "1.1",
    "fontSize": 90,
    "type": LayoutItemType.TITLE,
    "offsetLeft": 40,
  },
  {
    "offsetTop": 80,
    "position": 2,
    "fontLineHeight": "1",
    "fontLetterSpacing": "1.1",
    "fontSize": 50,
    "type": LayoutItemType.DESCRIPTION,
    "offsetLeft": 80,
  },
  {
    "offsetTop": 80,
    "position": 3,
    "fontLineHeight": "1",
    "fontLetterSpacing": "1.1",
    "fontSize": 0,
    "type": LayoutItemType.IMAGE,
    "offsetLeft": 40,
  }
];

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
  loggedInUser: Observable<AuthResponse | null> = EMPTY;
  downloadIcon = faDownload;
  saveChangesIcon = faSave;

  constructor(private currentComponentElemRef: ElementRef,
              private editorService: EditorService,
              private downloadService: DownloadCanvasService,
              private cmsService: CmsService) {
  }

  ngOnChanges(data: SimpleChanges): void {
    this.refreshCanvas();
    this.loggedInUser = this.cmsService.getUser();
  }

  setLayout($event: Preset) {
    this.layoutSetting = $event;
    this.refreshCanvas();
    console.log('layout selected');
  }

  /**
   * after selection of a new layout,
   * we need to refresh the canvas;
   */
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

  /**
   * update on server
   */
  updateValues(defaults?: PresetObject[] | null) {
    defaults = defaults || getPresetItem(this.canvas);

    if (defaults) {
      this.cmsService.update(defaults, this.layoutSetting.id);
    }
  }

  /**
   * resets the template to given defaults
   */
  resetTemplate() {
    this.layoutSetting.itemsJson = DEFAULT_ITEMS;
    this.setLayout(this.layoutSetting);
  }
}
