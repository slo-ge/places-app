import {Injectable} from '@angular/core';
import {EditorService} from "@app/core/editor/editor.service";
import {take} from "rxjs/operators";
import {MediaRecorderService} from "@app/core/editor/media-recorder.service";

export enum  DataUrlFileType {
  PNG = 'png',
  JPEG = 'jpeg',
  WEBP = 'webp'
}

export interface DownloadFormat {
  format: DataUrlFileType;
  quality?: number;
  multiplier?: number | undefined;
}

const DEFAULT_DOWNLOAD_SETTING = {
  format: DataUrlFileType.PNG
};

const DEFAULT_FILE_NAME = 'rendered-meta-mapper';

@Injectable({
  providedIn: 'root'
})
export class DownloadCanvasService {

  constructor(private editorService: EditorService,
              private mediaRecorder: MediaRecorderService) {
  }

  download(format: DownloadFormat = DEFAULT_DOWNLOAD_SETTING) {
    this.editorService.getCanvas()
      .pipe(take(1))
      .subscribe(canvas => {
        const link = document.createElement('a');
        link.download = `${DEFAULT_FILE_NAME}.${format.format}`;
        link.href = canvas.toDataURL(format);
        link.click();
      });
  }

  /**
   * TIPP: For animated backgrounds this method could be very usful
   */
  downloadAsVideo(duration: number) {
    this.editorService.getCanvas()
      .pipe(take(1))
      .subscribe(canvas => {
        this.mediaRecorder.getUrl(canvas, duration).then(url => window.open(url as string, '_blank'));
      });
  }
}
