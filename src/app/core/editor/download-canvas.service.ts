import {Injectable} from '@angular/core';
import {EditorService} from "@app/core/editor/editor.service";
import {take} from "rxjs/operators";
import {MediaRecorderService} from "@app/core/editor/media-recorder.service";

@Injectable({
  providedIn: 'root'
})
export class DownloadCanvasService {

  constructor(private editorService: EditorService,
              private mediaRecorder: MediaRecorderService) {
  }

  download(fileName: string = 'meta-mapper.png') {
    this.editorService.getCanvas().pipe(take(1)).subscribe(
      (canvas) => {
        const link = document.createElement('a');
        link.download = fileName;
        link.href = canvas.toDataURL();
        link.click();
      }
    );
  }

  /**
   * For animated backgrounds this method could be very usful
   */
  downloadAsVideo(duration: number) {
    this.editorService.getCanvas().pipe(take(1)).subscribe(
      (canvas) => {
        this.mediaRecorder.getUrl(canvas, duration).then(url => window.open(url as string, '_blank'));
      });
  }
}
