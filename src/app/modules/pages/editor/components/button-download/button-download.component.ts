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

    this.presetService.canvas.getElement().toBlob((blob: any) => {
      let file = new File([blob], "fileName.jpg", {type: "image/jpeg"});
      this.cmsService.uploadFile(file).pipe(take(1)).subscribe();
    });
  }
}
