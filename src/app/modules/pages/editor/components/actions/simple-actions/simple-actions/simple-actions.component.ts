import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Canvas, IEvent, Object as FabricObject} from "fabric/fabric-impl";
import {EditorService} from "@app/core/editor/editor.service";
import {
  faAlignCenter,
  faCaretSquareLeft,
  faCaretSquareRight,
  faEllipsisV,
  faLayerGroup,
  faSync,
  faTh,
  faTrashAlt
} from "@fortawesome/free-solid-svg-icons";
import {
  AlignmentService,
  dictToKeys,
  ObjectAlignments,
  SimpleAlignments
} from "@app/modules/pages/editor/components/actions/simple-actions/simple-actions/alignment.service";
import {CustomImageBox, CustomObject, CustomTextBox} from "@app/core/editor/fabric-object.utils";
import {ObjectPosition} from "@app/core/model/preset";
import {CmsAuthService} from "@app/core/services/cms-auth.service";
import {Subscription} from "rxjs";
import {copyPasteKeyPress} from "@app/modules/pages/editor/utils/copy-paste";

enum FabricType {
  TEXTBOX = 'textbox',
  IMAGE = 'image'
}

@Component({
  selector: 'app-simple-actions',
  templateUrl: './simple-actions.component.html',
  styleUrls: ['./simple-actions.component.scss']
})
export class SimpleActionsComponent implements OnInit, OnDestroy {
  canvas: any | Canvas;

  activeRangeSliderMax = 100;
  activeRangeSliderCurrentValue = 50;
  iconRemove = faTrashAlt;
  iconLeft = faCaretSquareLeft;
  iconRight = faCaretSquareRight;
  iconCenter = faAlignCenter;
  iconRotate = faSync;
  iconLayer = faLayerGroup;
  iconRasta = faTh;
  iconMore = faEllipsisV;

  objectAlignments = dictToKeys(ObjectAlignments);
  simpleAlignments = SimpleAlignments;

  fabricType = FabricType;
  selectedType: FabricType | null = null;

  ObjectPosition = ObjectPosition;
  /**
   * holds the selected Object, if it is selected
   */
  activeObject: CustomObject | CustomImageBox | CustomTextBox | any = null;

  private subscriptions: Subscription = new Subscription();

  constructor(private editorService: EditorService,
              private alignmentService: AlignmentService,
              // used in template, dirty.
              public authService: CmsAuthService) {
  }

  ngOnInit(): void {
    const sub = this.editorService.getCanvas().subscribe(canvas => {
      this.canvas = canvas;
      this.canvas.on(
        {
          'selection:created': (event: any) => this.selectionEvent(event),
          'selection:updated': (event: any) => this.selectionEvent(event),
          'selection:cleared': (event: any) => this.selectionEndEvent(event),
        },
      );
    });
    this.subscriptions.add(sub);
  }

  @HostListener('document:keydown.delete', ['$event'])
  keyEventDelete(_event: KeyboardEvent) {
    this.removeActiveObject();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    copyPasteKeyPress($event, this.activeObject,  this.canvas);
  }

  /**
   * this is the deselect logic,
   * but at least it does not work correctly because of the
   * sketchy canvas container. It only removes selection on double click
   */
  @HostListener('document:keydown.esc', ['$event'])
  onKeyDown(_event: any): void {
    this.canvas.discardActiveObject().renderAll();
  }

  removeActiveObject() {
    const removableObjects = typeof this.activeObject?.getObjects === 'function'
      ? this.activeObject.getObjects()
      : [this.activeObject];

    for (const obj of removableObjects) {
      this.canvas.remove(obj);
    }
  }

  private selectionEvent(_e: IEvent) {
    this.activeObject = this.canvas.getActiveObject();
    this.activeObject.set({
      borderColor: '#20bfa9',
      cornerColor: '#20bfa9',
      borderScaleFactor: 2
    });

    if (this.activeObject.isType('textbox')) {
      this.activeRangeSliderCurrentValue = Number(this.activeObject.fontSize);
      this.activeRangeSliderMax = 300;
      this.selectedType = FabricType.TEXTBOX;
    } else if (this.activeObject.isType('image')) {
      this.activeRangeSliderCurrentValue = Number(this.activeObject.getScaledWidth());
      this.activeRangeSliderMax = Number(1200);
      this.selectedType = FabricType.IMAGE;
    } else {
      console.error('onCanvasEvent could not found Object:', this.activeObject)
    }
  }

  private selectionEndEvent(_e: IEvent & { selected: FabricObject[] }) {
    this.activeObject = null;
    this.selectedType = null;
  }

  changeSize(newWidth: number | string) {
    newWidth = Number(newWidth);
    const activeObject = this.activeObject;
    if (this.activeObject.isType('textbox')) {
      activeObject.fontSize = newWidth;
    } else if (this.activeObject.isType('image')) {
      activeObject.scaleToWidth(newWidth);
    } else {
      console.error('changeSize, can not change size of object:', activeObject)
    }
    this.canvas.renderAll();
  }

  turn90() {
    const activeObject = this.activeObject;
    if (activeObject) {
      activeObject.centeredRotation = true;
      activeObject.rotate(activeObject.angle + 90);
      this.canvas.renderAll();
    }
  }

  alignmentAction(aligner: ObjectAlignments | SimpleAlignments) {
    this.alignmentService.move(aligner, this.canvas, this.activeObject);
  }

  moveToBack() {
    const activeObject = this.activeObject;
    const position = this.canvas.getObjects().indexOf(activeObject);

    if (position > 1) {
      this.canvas.moveTo(activeObject, position - 1);
    }
  }

  moveToFront() {
    const activeObject = this.activeObject as any;
    const position = this.canvas.getObjects().indexOf(activeObject);
    this.canvas.moveTo(activeObject, position + 1);
  }

  /**
   * Set a css-like position to the selected object
   * @param position
   */
  position(position: ObjectPosition) {
    const activeObject = this.activeObject as CustomObject;
    activeObject.presetObjectPosition = position;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
