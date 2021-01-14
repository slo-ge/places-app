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
    this.canvas.next(canvas);
    this.currentCanvas = canvas;
  }

  getCanvas(): Observable<any> {
    return this.canvas.asObservable();
  }
}
