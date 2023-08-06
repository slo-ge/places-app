import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { faDownload, faInfo } from '@fortawesome/free-solid-svg-icons';
import {
  DataUrlFileType,
  DownloadCanvasService,
} from '@app/core/editor/download-canvas.service';
import { PresetService } from '@app/core/editor/preset.service';
import { take } from 'rxjs/operators';
import { AuthResponse, CmsService } from '@app/core/services/cms.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EMPTY, Observable } from 'rxjs';
import { CmsAuthService } from '@app/core/services/cms-auth.service';
import { StaticContentAdapter } from '@app/core/services/adapters/static-content.adapter';
import { getScaledImage } from '@app/core/editor/canvas.utils';
import { FeedbackService } from '@app/modules/shared/components/feedback/feedback.service';

interface SelectOption {
  formControlName: string;
  value: any;
  label: any;
}

@Component({
  selector: 'app-tab-download',
  templateUrl: './tab-download.component.html',
  styleUrls: ['./tab-download.component.scss']
})
export class TabDownloadComponent implements OnChanges, OnInit {
  @Input()
  presetService: PresetService | null = null;
  currentUser$: Observable<AuthResponse | null> = EMPTY;

  readonly downloadIcon = faDownload;
  readonly faInfo = faInfo;

  readonly formatOption: SelectOption[] = [
    {formControlName: 'downloadMode', value: DataUrlFileType.PNG, label: `${DataUrlFileType.PNG}`.toUpperCase()},
    {formControlName: 'downloadMode', value: DataUrlFileType.WEBP, label: `${DataUrlFileType.WEBP}`.toUpperCase()},
    {formControlName: 'downloadMode', value: DataUrlFileType.JPEG, label: `${DataUrlFileType.JPEG}`.toUpperCase()}
  ];

  downloadSizes: SelectOption[] = [];

  private getSize(factor: number) {
    const newWidth = this.presetService?.preset.width! * factor;
    const newHeight = this.presetService?.preset.height! * factor;
    return `${Math.round(newWidth)}px x ${Math.round(newHeight)}px`;
  }

  extended = false;
  recording = false;
  staticUrl: string | null = null;


  form = new FormGroup({
    upload: new FormControl(false),
    downloadMode: new FormControl<DataUrlFileType>(DataUrlFileType.PNG, [Validators.required]),
    downloadSize: new FormControl<number>(1, [Validators.required])
  });


  constructor(private downloadService: DownloadCanvasService,
              private cmsService: CmsService,
              private authService: CmsAuthService,
              private feedbackService: FeedbackService) {
  }

  ngOnInit(): void {
    this.currentUser$ = this.authService.getUser();
  }

  ngOnChanges(): void {
    this.extended = !!this.presetService?.info?.isAnimatedBackground;

    this.downloadSizes = [
      {formControlName: 'downloadSize', value: 3, label: this.getSize(3)},
      {formControlName: 'downloadSize', value: 2, label: this.getSize(2)},
      {formControlName: 'downloadSize', value: 1, label: this.getSize(1)},
      {formControlName: 'downloadSize', value: 0.5, label: this.getSize(0.5)},
      {formControlName: 'downloadSize', value: 0.3, label: this.getSize(0.3)}
    ];
  }

  downloadImage() {
    if (this.form.get('upload')?.value) {
      this.uploadImage();
    }

    let format = this.form.get('downloadMode')?.value || DataUrlFileType.PNG;
    const formSize = this.form.get('downloadSize')?.value!
    this.downloadService.download({
      format,
      multiplier: formSize === 1 ? undefined : formSize
    });
  }

  openFeedbackOnlyOnFirstTime() {
    this.feedbackService.openAtFirstTime();
  }

  downloadVideo(number: number) {
    this.recording = true;
    setTimeout(() => this.recording = false, number);
    this.downloadService.downloadAsVideo(number || 4000);
  }

  /**
   * Maps current preset and edited text to a static adapter link
   */
  createStaticEditorLink() {
    const staticUrl = StaticContentAdapter.shareUrl(this.presetService!);
    if (staticUrl) {
      this.staticUrl = staticUrl.href;

      const placeholder = document.createElement("textarea");
      document.body.appendChild(placeholder);
      placeholder.value = this.staticUrl;
      placeholder.select();
      document.execCommand("copy");
      document.body.removeChild(placeholder);
    } else {
      console.log('static url can not be created');
    }
  }

  private uploadImage() {
    if (!this.presetService) {
      console.error('preset service is not present in button-download');
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
