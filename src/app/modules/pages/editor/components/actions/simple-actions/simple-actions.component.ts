import { Component, forwardRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Canvas, IEvent, Object as FabricObject } from "fabric/fabric-impl";
import { EditorService } from "@app/core/editor/editor.service";
import { faDownload, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { Subscription } from "rxjs";
import { Breakpoint, BreakpointObserverService } from "@app/core/services/breakpoint-observer.service";
import { take } from "rxjs/operators";
import { setCornerLines } from "@app/core/editor/overrides/setcornercoords";
import { ActiveObjectService, ActiveObjectType } from "@app/modules/pages/editor/components/actions/action";
import { DownloadCanvasService } from "@app/core/editor/download-canvas.service";
import { FeedbackService } from "@app/modules/shared/components/feedback/feedback.service";

enum FabricType {
  TEXTBOX = 'textbox',
  IMAGE = 'image'
}

@Component({
  selector: 'app-simple-actions',
  templateUrl: './simple-actions.component.html',
  styleUrls: ['./simple-actions.component.scss'],
  providers: [{
    provide: ActiveObjectService,
    useExisting: forwardRef(() => SimpleActionsComponent)
  }]
})
export class SimpleActionsComponent extends ActiveObjectService implements OnInit, OnDestroy {
  /**
   * this is the deselect logic,
   * but at least it does not work correctly because of the
   * sketchy canvas container. It only removes selection on double click
   */
  @HostListener('document:keydown.esc', ['$event'])
  onKeyDown(_event: any): void {
    this.canvas.discardActiveObject().renderAll();
  }

  canvas: any | Canvas;

  iconMore = faEllipsisV;
  iconDownload = faDownload
  fabricType = FabricType;
  selectedType: FabricType | null = null;


  /**
   * holds the selected Object, if it is selected
   */
  activeObject: ActiveObjectType | any = null;

  private subscriptions: Subscription = new Subscription();
  private currentBreakpoint: Breakpoint | null = null;

  constructor(private editorService: EditorService,
              private breakpoint: BreakpointObserverService,
              private downloadService: DownloadCanvasService,
              private feedbackService: FeedbackService) {
    super();
  }

  ngOnInit(): void {
    const canvasSubscription = this.editorService.getCanvas().subscribe(canvas => {
      this.canvas = canvas;
      this.canvas.on(
        {
          'selection:created': (event: any) => this.selectionEvent(event),
          'selection:updated': (event: any) => this.selectionEvent(event),
          'selection:cleared': (event: any) => this.selectionEndEvent(event)
        },
      );
    });
    this.subscriptions.add(canvasSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getActiveObject(): ActiveObjectType {
    return this.activeObject;
  }

  private selectionEvent(_e: IEvent) {
    this.activeObject = this.canvas.getActiveObject();

    if (this.currentBreakpoint) {
      setCornerLines(this.activeObject, this.currentBreakpoint);
    } else {
      this.breakpoint.getSize()
        .pipe(take(1))
        .subscribe(b => {
          this.currentBreakpoint = b;
          setCornerLines(this.activeObject, b);
        });
    }

    if (this.activeObject.isType('textbox')
      || this.activeObject.isType('circle')
      || this.activeObject.isType('rect')
    ) {
      this.selectedType = FabricType.TEXTBOX;
    } else if (this.activeObject.isType('image')) {
      this.selectedType = FabricType.IMAGE;
    } else {
      console.warn('Object with type', this.activeObject.type, 'only partial supported');
    }
  }

  private selectionEndEvent(_e: IEvent & { selected: FabricObject[] }) {
    this.activeObject = null;
    this.selectedType = null;
  }

  download() {
    this.downloadService.download();
    this.feedbackService.openAtFirstTime();
  }
}
