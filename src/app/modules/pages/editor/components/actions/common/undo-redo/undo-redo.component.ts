import {Component} from '@angular/core';
import {SaveService} from "@app/core/editor/save.service";
import {faRedo, faUndo} from "@fortawesome/free-solid-svg-icons";
import {Observable} from "rxjs";

@Component({
  selector: 'app-undo-redo',
  templateUrl: './undo-redo.component.html',
  styleUrls: ['./undo-redo.component.scss']
})
export class UndoRedoComponent {
  iconUndo = faUndo;
  iconRedo = faRedo;

  constructor(private saveService: SaveService) {
  }

  undo() {
    this.saveService.undoAction();
  }

  redo() {
    this.saveService.redoAction();
  }

  get isUndoable$(): Observable<boolean> {
    return this.saveService.isUndoable$;
  }

  get isReDoable$(): Observable<boolean> {
    return this.saveService.isReDoable$;
  }
}
