import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from "rxjs";
import {Canvas} from "fabric/fabric-impl";

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  private canvas: ReplaySubject<any | Canvas> = new ReplaySubject(1);
  private currentCanvas: Canvas | null = null;

  constructor() {
  }

  setCanvas(canvas: any) {
    if(this.currentCanvas !== null) {
      EditorService.removeListener(this.currentCanvas);
      this.currentCanvas.clear();
    }

    this.canvas.next(canvas);
    this.currentCanvas = canvas;
  }

  getCanvas(): Observable<Canvas> {
    return this.canvas.asObservable();
  }

  /**
   * On canvas change we do remove all eventListeners on old canvas
   *
   * @param canvas
   * @private
   */
  private static removeListener(canvas: Canvas) {
    canvas.clear();
    (canvas as any).__eventListeners = {};
  }
}
