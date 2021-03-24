import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {faDownload} from "@fortawesome/free-solid-svg-icons";
import {DownloadCanvasService} from "@app/core/editor/download-canvas.service";
import {PresetService} from "@app/core/editor/preset.service";
import {take} from "rxjs/operators";
import {AuthResponse, CmsService} from "@app/core/services/cms.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {EMPTY, Observable} from "rxjs";

@Component({
  selector: 'app-button-download',
  templateUrl: './button-download.component.html',
  styleUrls: ['./button-download.component.scss']
})
export class ButtonDownloadComponent implements OnChanges, OnInit {
  @Input()
  presetService: PresetService | null = null;
  currentUser$: Observable<AuthResponse | null> = EMPTY;

  extended = false;
  downloadIcon = faDownload;
  recording = false;
  form = new FormGroup({
    upload: new FormControl(false),
  });

  constructor(private downloadService: DownloadCanvasService,
              private formBuilder: FormBuilder,
              private cmsService: CmsService) {
  }

  ngOnInit(): void {
    this.currentUser$ = this.cmsService.getUser();
  }

  ngOnChanges(sC: SimpleChanges): void {
    this.extended = !!this.presetService?.info?.isAnimatedBackground;
  }

  downloadImage() {
    if (this.form.get('upload')?.value) {
      this.uploadImage();
    }
    this.downloadService.download();
  }

  downloadVideo(number: number) {
    this.recording = true;
    setTimeout(() => this.recording = false, number);
    this.downloadService.downloadAsVideo(number || 4000);
  }


  private uploadImage() {
    if (!this.presetService) {
      return;
    }

    const originCanvas = this.presetService.canvas.getElement();
    const tmpCanvas = getScaledImage(originCanvas, 800, 800);
    tmpCanvas.toBlob((blob: any) => {
      let file = new File([blob], "fileName.jpg", {type: "image/jpeg"});
      this.cmsService.createPreview(file, this.presetService!.metaMapperData)
        .pipe(take(1))
        .subscribe();
    });
  }
}

/**
 * scales the canvas to a different width and height,
 * and returns the new canvas HtmlElement
 */
export function getScaledImage(originCanvas: HTMLCanvasElement, maxWidth: number, maxHeight: number): HTMLCanvasElement {
  const ratioX = maxWidth / originCanvas.width;
  const ratioY = maxHeight / originCanvas.height;
  const ratio = Math.min(ratioX, ratioY);

  const newWidth = Math.round(originCanvas.width * ratio);
  const newHeight = Math.round(originCanvas.height * ratio);

  const tmpCanvas = document.createElement('canvas');
  const ctx = tmpCanvas.getContext('2d');
  tmpCanvas.width = newWidth;
  tmpCanvas.height = newHeight;
  ctx?.drawImage(originCanvas, 0, 0, originCanvas.width, originCanvas.height, 0, 0, tmpCanvas.width, tmpCanvas.height);
  return tmpCanvas;
}
