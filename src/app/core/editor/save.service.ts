import {Injectable} from '@angular/core';
import {fabric} from "fabric";
import {BehaviorSubject, Observable} from "rxjs";

// https://stackoverflow.com/a/32618231
// TODO: this feature is a bit experimental and is not fully tested
@Injectable({
  providedIn: 'root'
})
export class SaveService {
  undo: string[] = [];
  redo: string[] = [];

  canvas!: fabric.Canvas;
  state: string | null = null;

  private currentUndo: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private currentRedo: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get isUndoable$(): Observable<boolean> {
    return this.currentUndo.asObservable();
  }

  get isReDoable$(): Observable<boolean> {
    return this.currentRedo.asObservable();
  }

  constructor() {}

  /**
   * entry point, must be called on every canvas change
   * @param canvas
   */
  public init(canvas: fabric.Canvas | any) {
    this.undo = [];
    this.redo = [];
    this.state = null;
    this.canvas = canvas;
    this.currentRedo.next(false);
    this.currentUndo.next(false);

    canvas.on({
      'object:modified': (_event: any) => this.save()
    });

    setTimeout(() => this.save(), 1500);
  }

  public undoAction() {
    this.replay(this.undo, this.redo);
  }

  public redoAction() {
    this.replay(this.redo, this.undo);
  }

  private save() {
    this.redo = [];
    if (this.state) {
      this.undo.push(this.state);

      this.currentUndo.next(true);
      this.currentRedo.next(false);
    }
    this.state = this.canvas.toJSON(['selectable', 'name', 'ownType', 'ddlValue', 'lockScalingX', 'textAlign']);
  }

  private replay(playStack: string[], saveStack: string[]) {
    if (!playStack.length) {
      return;
    }

    saveStack.push(this.state!);
    this.state = playStack.pop()!;
    this.canvas.clear();
    this.canvas.loadFromJSON(this.state, () => {
      this.canvas.renderAll();
    });

    // set new undo and redo state
    this.currentRedo.next(!!this.redo.length);
    this.currentUndo.next(!!this.undo.length);
  }
}
