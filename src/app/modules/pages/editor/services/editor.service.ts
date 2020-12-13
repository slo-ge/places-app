import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from "rxjs";
import {tap} from "rxjs/operators";
import {Canvas} from "fabric/fabric-impl";

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  private canvas: ReplaySubject<any | Canvas> = new ReplaySubject(1);

  constructor() {
  }

  setCanvas(canvas: any) {
    this.canvas.next(canvas);
  }

  getCanvas(): Observable<any> {
    return this.canvas.asObservable();
  }
}
