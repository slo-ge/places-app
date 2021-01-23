import {Component, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ObjectDisplayProperties} from "@app/modules/pages/editor/models";
import {fabric} from "fabric";
import {LayoutItemType, Preset, PresetObject} from "@app/core/model/preset";
import {EditorService} from "@app/modules/pages/editor/services/editor.service";
import {PresetService} from "@app/modules/pages/editor/services/preset.service";
import {DownloadCanvasService} from "@app/modules/pages/editor/services/download-canvas.service";
import {faDownload, faSave, faUndo} from "@fortawesome/free-solid-svg-icons";
import {AuthResponse, CmsService} from "@app/core/services/cms.service";
import {getPresetItem} from "@app/modules/pages/editor/services/fabric-object.utils";
import {EMPTY, Observable} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {take} from "rxjs/operators";


const DEFAULT_SETTING: Preset = {
  "id": 23,
  "width": 900,
  "height": 1600,
  "title": "MetaMapper 9:16",
  "fontFamilyHeadingCSS": "Archivo Black, sans-serif",
  "itemsJson": [
    {
      "type": "title" as LayoutItemType.TITLE,
      "offsetTop": 221,
      "offsetLeft": 123,
      "position": 0,
      "objectAngle": 0,
      "fontSize": 90,
      "fontColor": "#ffffff",
      "fontWeight": "normal",
      "fontLineHeight": "1",
      "fontLetterSpacing": "1.1"
    },
    {
      "type": "image" as LayoutItemType.IMAGE,
      "offsetTop": 10,
      "offsetLeft": 77,
      "position": 1,
      "objectAngle": 0
    },
    {
      "type": "description" as LayoutItemType.DESCRIPTION,
      "offsetTop": 62,
      "offsetLeft": 113,
      "position": 2,
      "objectAngle": 0,
      "fontSize": 29,
      "fontColor": "#ffffff",
      "fontWeight": "normal",
      "fontLineHeight": "1",
      "fontLetterSpacing": "1.1"
    }
  ],
  "backgroundImage": {
    "id": 39,
    "name": "MetaMapper",
    "alternativeText": "",
    "caption": "",
    "width": 900,
    "height": 1600,
    "formats": {
      "thumbnail": {
        "hash": "thumbnail_Meta_Mapper_c2604b32f5",
        "ext": ".png",
        "mime": "image/png",
        "width": 88,
        "height": 156,
        "size": 1.84,
        "path": null,
        "url": "/uploads/thumbnail_Meta_Mapper_c2604b32f5.png"
      },
      "large": {
        "hash": "large_Meta_Mapper_c2604b32f5",
        "ext": ".png",
        "mime": "image/png",
        "width": 563,
        "height": 1000,
        "size": 19.19,
        "path": null,
        "url": "/uploads/large_Meta_Mapper_c2604b32f5.png"
      },
      "medium": {
        "hash": "medium_Meta_Mapper_c2604b32f5",
        "ext": ".png",
        "mime": "image/png",
        "width": 422,
        "height": 750,
        "size": 13.62,
        "path": null,
        "url": "/uploads/medium_Meta_Mapper_c2604b32f5.png"
      },
      "small": {
        "hash": "small_Meta_Mapper_c2604b32f5",
        "ext": ".png",
        "mime": "image/png",
        "width": 281,
        "height": 500,
        "size": 8.34,
        "path": null,
        "url": "/uploads/small_Meta_Mapper_c2604b32f5.png"
      }
    },
    "hash": "Meta_Mapper_c2604b32f5",
    "ext": ".png",
    "mime": "image/png",
    "size": 16.12,
    "url": "/uploads/Meta_Mapper_c2604b32f5.png",
    "previewUrl": null,
    "provider": "local",
    "provider_metadata": null,
    "created_at": new Date(),
    "updated_at": new Date()
  },
};

const DEFAULT_ITEMS: PresetObject[] = [
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
  undoIcon = faUndo;
  sentUpdateResponse: string | null = '';

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

    if (!defaults) {
      return;
    }
    this.cmsService.update(defaults, this.layoutSetting.id)
      .pipe(take(1))
      .subscribe(
        res => this.sentUpdateResponse = `updated at: ${res.updated_at?.toString() || null}`,
        (err: HttpErrorResponse) => this.sentUpdateResponse = err.message
      );
  }

  /**
   * resets the template to given defaults
   */
  resetTemplate() {
    this.layoutSetting.itemsJson = DEFAULT_ITEMS;
    this.setLayout(this.layoutSetting);
  }
}
