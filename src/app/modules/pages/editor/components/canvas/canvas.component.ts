import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MetaMapperData} from "@app/modules/pages/editor/models";
import {fabric} from "fabric";
import {Preset, PresetObject} from "@app/core/model/preset";
import {EditorService} from "@app/core/editor/editor.service";
import {PresetService} from "@app/core/editor/preset.service";
import {
  faAngleUp,
  faBars,
  faCode,
  faCogs,
  faDownload,
  faPalette,
  faSave,
  faUndo, faUser
} from "@fortawesome/free-solid-svg-icons";
import {AuthResponse, CmsService} from "@app/core/services/cms.service";
import {getPresetItem} from "@app/core/editor/fabric-object.utils";
import {EMPTY, Observable} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {take} from "rxjs/operators";
import {DEFAULT_ITEMS, mergeLayouts} from "@app/modules/pages/editor/components/canvas/defaults";
import {Canvas} from "fabric/fabric-impl";
import {ActivatedRoute} from "@angular/router";
import {CmsAuthService} from "@app/core/services/cms-auth.service";
import {SaveService} from "@app/core/editor/save.service";
import { FeatureFlags } from '@shared-lib/config';


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss', './canvas.component.mobile.scss']
})
export class CanvasComponent implements OnInit, OnChanges {
  @Input()
  metaProperties: MetaMapperData = {} as any;

  readonly FeatureFlags = FeatureFlags;

  preset: Preset = {} as any;
  canvas: Canvas | any;
  currentPresetService: PresetService | null = null;
  loggedInUser: Observable<AuthResponse | null> = EMPTY;

  readonly saveChangesIcon = faSave;
  readonly undoIcon = faUndo;
  readonly faCode = faCode;
  readonly faPalette = faPalette;
  readonly faDownload = faDownload;
  readonly faPlus = faBars;
  readonly faWindowClose = faAngleUp;
  readonly faUser = faUser;

  sentUpdateResponse: string | null = '';
  zoomFactor = 1;
  initZoom = 1;

  loading = true;

  canvasWrapperWidth: number | null = null;
  canvasWrapperHeight: number | null = null;

  mobileToolbar = false;

  constructor(private editorService: EditorService,
              private cmsService: CmsService,
              private authService: CmsAuthService,
              private activatedRoute: ActivatedRoute,
              private saveService: SaveService) {
  }


  ngOnInit(): void {
    // check if presetId is set, if it's set, just apply it
    // from preset resolver otherwise
    // the default template is applied
    const preset = this.activatedRoute.snapshot.data.preset;
    if (preset) {
      this.setLayout(preset);
    } else {
      this.refreshCanvas();
    }
  }

  ngOnChanges(data: SimpleChanges): void {
    this.loggedInUser = this.authService.getUser();
  }

  setLayout($preset: Preset) {
    this.preset = $preset;
    this.refreshCanvas();
  }

  /**
   * After selection of a new layout,
   * we need to refresh the canvas;
   */
  refreshCanvas() {
    this.loading = true;
    if (this.canvas == null) {
      this.canvas = new fabric.Canvas('myCanvas', {
        preserveObjectStacking: true, // keeps all objects on der layer position when moving
        allowTouchScrolling: true,
        enableRetinaScaling: false
      });
    } else {
      this.canvas.clear();
    }

    this.editorService.setCanvas(this.canvas);
    this.preset = mergeLayouts(this.preset);

    if (this.metaProperties) {
      this.currentPresetService = new PresetService(
        this.canvas,
        this.metaProperties,
        this.preset
      );

      this.canvas.setHeight(this.preset.height);
      this.canvas.setWidth(this.preset.width);
      this.canvas.renderAll();
      this.initialZoom();
      this.currentPresetService.initObjectsOnCanvas().then(
        () => {
          this.saveService.init(this.canvas);
          this.loading = false;
        },
        err => {
          console.error(err);
          this.loading = false;
        }
      );
    }
  }

  /**
   * Update the template in CMS
   */
  updateValues(defaults?: PresetObject[] | null) {
    defaults = defaults || getPresetItem(this.canvas);

    if (!defaults) {
      return;
    }
    this.cmsService.update(defaults, this.preset.id)
      .pipe(take(1))
      .subscribe(
        res => this.sentUpdateResponse = `updated at: ${res.updated_at?.toString() || null}`,
        (err: HttpErrorResponse) => this.sentUpdateResponse = err.message
      );
  }

  /**
   * Resets the template to predefined defaults
   */
  resetTemplate() {
    this.preset.itemsJson = DEFAULT_ITEMS;
    this.setLayout(this.preset);
  }

  setZoomFactor($event: number) {
    this.zoomFactor = $event;
  }

  /**
   * Calculate zoom from given canvas
   */
  private initialZoom() {
    this.zoomFactor = 1;
    if (this.canvasWrapperWidth === null || this.canvasWrapperHeight === null) {
      const canvasWrapper = document.getElementsByClassName('canvas-wrapper')[0];
      this.canvasWrapperWidth = canvasWrapper.clientWidth;
      this.canvasWrapperHeight = canvasWrapper.clientHeight;
    }

    const canvasWidth = this.preset.width;
    const usedW = (1 / this.canvasWrapperWidth) * canvasWidth;
    const canvasHeight = this.preset.height;
    const usedH = (1 / this.canvasWrapperHeight) * canvasHeight;

    // check in which dimension the  canvas uses more space, vertical or horizontal
    // then decide which scale will be applied to the canvas
    if (usedW < 1 && usedH < 1) {
      this.initZoom = this.zoomFactor = 1;
      return;
    }
    if (usedW > usedH) {
      this.initZoom = this.zoomFactor = 1 / usedW;
    } else {
      this.initZoom = this.zoomFactor = 1 / usedH;
    }
  }
}
