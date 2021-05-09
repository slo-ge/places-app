import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {faDownload, faInfo} from "@fortawesome/free-solid-svg-icons";
import {DownloadCanvasService} from "@app/core/editor/download-canvas.service";
import {PresetService} from "@app/core/editor/preset.service";
import {take} from "rxjs/operators";
import {AuthResponse, CmsService} from "@app/core/services/cms.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {EMPTY, Observable} from "rxjs";
import {CmsAuthService} from "@app/core/services/cms-auth.service";
import {ActionType, GoogleAnalyticsService} from "@app/core/services/google-analytics.service";
import {StaticContentAdapter} from "@app/core/services/adapters/static-content.adapter";
import {getScaledImage} from "@app/core/editor/canvas.utils";

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
  faInfo = faInfo;
  recording = false;
  staticUrl: string | null = null;

  form = new FormGroup({
    upload: new FormControl(false),
  });

  constructor(private downloadService: DownloadCanvasService,
              private formBuilder: FormBuilder,
              private cmsService: CmsService,
              private authService: CmsAuthService,
              private googleAnalytics: GoogleAnalyticsService) {
  }

  ngOnInit(): void {
    this.currentUser$ = this.authService.getUser();
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

  /**
   * TODO: use directive for tracking
   */
  track() {
    const presetTitle = this.presetService?.preset?.title || null;
    const presetID = this.presetService?.preset?.id || null;
    this.googleAnalytics.triggerClick(ActionType.CLICK_DOWNLOAD_CANVAS, `Download Button ${presetTitle} / ID: ${presetID}`);
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
}
