import {Injectable} from '@angular/core';
import {EditorService} from "@app/modules/pages/editor/services/editor.service";
import {take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DownloadCanvasService {

  constructor(private editorService: EditorService) {
  }

  download(fileName: string = 'export-latest.png') {
    this.editorService.getCanvas().pipe(take(1)).subscribe(
      (canvas) => {
        const link = document.createElement('a');
        link.download = fileName;
        link.href = canvas.toDataURL();
        link.click();
      }
    );
  }
}
