import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MetaMapperData} from "@app/modules/pages/editor/models";
import {fabric} from "fabric";
import {Preset, PresetObject} from "@app/core/model/preset";
import {EditorService} from "@app/core/editor/editor.service";
import {PresetService} from "@app/core/editor/preset.service";
import {DownloadCanvasService} from "@app/core/editor/download-canvas.service";
import {faDownload, faSave, faUndo} from "@fortawesome/free-solid-svg-icons";
import {AuthResponse, CmsService} from "@app/core/services/cms.service";
import {getPresetItem} from "@app/core/editor/fabric-object.utils";
import {EMPTY, Observable} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {take} from "rxjs/operators";
import {DEFAULT_ITEMS, mergeLayouts} from "@app/modules/pages/editor/components/canvas/defaults";
import {Canvas} from "fabric/fabric-impl";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

declare var MediaRecorder: any;

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, OnChanges {
  @Input()
  metaProperties: MetaMapperData = {} as any;
  preset: Preset = {} as any;
  canvas: Canvas | any;
  currentPresetService: PresetService | null = null;
  loggedInUser: Observable<AuthResponse | null> = EMPTY;
  downloadIcon = faDownload;
  saveChangesIcon = faSave;
  undoIcon = faUndo;
  sentUpdateResponse: string | null = '';
  videoBlobUrl: SafeUrl | null = null;

  constructor(private editorService: EditorService,
              private downloadService: DownloadCanvasService,
              private cmsService: CmsService,
              private activatedRoute: ActivatedRoute,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    // check if presetId is set, if its set, just apply it
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
    this.loggedInUser = this.cmsService.getUser();
  }

  setLayout($preset: Preset) {
    this.preset = $preset;
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

      this.currentPresetService.initObjectsOnCanvas();

      const video = this.getVideoElement();
      const fabVideo = new fabric.Image(video, {left: 0, top: 0});
      this.canvas.add(fabVideo);

      (fabVideo.getElement() as HTMLVideoElement).play();
      let self = this;
      fabric.util.requestAnimFrame(function render() {
        self.canvas.renderAll();
        fabric.util.requestAnimFrame(render);
      })
    }
  }

  download() {
    //this.downloadService.download();
    this.record(this.canvas.getElement(), 4000).then(data => {
      this.videoBlobUrl = this.sanitizer.bypassSecurityTrustUrl(data);
    });
  }

  record(canvas: HTMLCanvasElement, time: number): Promise<string> {
    const recordedChunks = [] as any;
    return new Promise( (res, _rej) => {
      const stream = (canvas as any).captureStream(25 /*fps*/);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp9"
      });

      //ondataavailable will fire in interval of `time || 4000 ms`
      mediaRecorder.start(time || 4000);

      mediaRecorder.ondataavailable =  (_e: any) => {
        recordedChunks.push((event as any).data);

        if (mediaRecorder.state === 'recording') {
          // after stop data avilable event run one more time
          mediaRecorder.stop();
        }

      };

      mediaRecorder.onstop =  (_event: any) => {
        const blob = new Blob(recordedChunks, {
          type: "video/webm"
        });
        const url = URL.createObjectURL(blob);
        res(url);
      }
    })
  }

  /**
   * update on server
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
   * resets the template to given defaults
   */
  resetTemplate() {
    this.preset.itemsJson = DEFAULT_ITEMS;
    this.setLayout(this.preset);
  }

  getVideoElement(url: string = '/assets/video/test.mp4') {
    const videoE = document.createElement('video');
    videoE.width = 530;
    videoE.height = 298;
    videoE.muted = true;
    videoE.crossOrigin = "anonymous";
    const source = document.createElement('source');
    source.src = url;
    source.type = 'video/mp4';
    videoE.appendChild(source);
    return videoE;
  }
}
