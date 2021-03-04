import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {faDownload} from "@fortawesome/free-solid-svg-icons";
import {DownloadCanvasService} from "@app/core/editor/download-canvas.service";
import {PresetService} from "@app/core/editor/preset.service";

@Component({
  selector: 'app-button-download',
  templateUrl: './button-download.component.html',
  styleUrls: ['./button-download.component.scss']
})
export class ButtonDownloadComponent implements OnChanges {
  @Input()
  presetService: PresetService | null = null;

  extended = false;
  downloadIcon = faDownload;
  recording = false;

  constructor(private downloadService: DownloadCanvasService) { }

  ngOnChanges(sC: SimpleChanges): void {
    this.extended = !!this.presetService?.info?.isAnimatedBackground;
  }

  downloadImage() {
      this.downloadService.download();
  }

  downloadVideo(number: number) {
    this.recording = true;
    setTimeout(() => this.recording = false, number);

    this.downloadService.downloadAsVideo(number || 4000);
  }
}
