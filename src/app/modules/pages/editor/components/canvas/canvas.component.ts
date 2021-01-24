import {Component, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import {MetaProperties} from "@app/modules/pages/editor/models";
import {fabric} from "fabric";
import {Preset, PresetObject} from "@app/core/model/preset";
import {EditorService} from "@app/modules/pages/editor/services/editor.service";
import {PresetService} from "@app/modules/pages/editor/services/preset.service";
import {DownloadCanvasService} from "@app/modules/pages/editor/services/download-canvas.service";
import {faDownload, faSave, faUndo} from "@fortawesome/free-solid-svg-icons";
import {AuthResponse, CmsService} from "@app/core/services/cms.service";
import {getPresetItem} from "@app/modules/pages/editor/services/fabric-object.utils";
import {EMPTY, Observable} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {take} from "rxjs/operators";
import {DEFAULT_ITEMS, mergeLayouts} from "@app/modules/pages/editor/components/canvas/defaults";
import {Canvas} from "fabric/fabric-impl";


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnChanges {
  @Input()
  canvasSettings: MetaProperties = {} as any;
  layoutSetting: Preset = {} as any;
  canvas: Canvas | any;
  currentPresetService: PresetService | null = null;
  loggedInUser: Observable<AuthResponse | null> = EMPTY;
  downloadIcon = faDownload;
  saveChangesIcon = faSave;
  undoIcon = faUndo;
  sentUpdateResponse: string | null = '';

  constructor(private editorService: EditorService,
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
