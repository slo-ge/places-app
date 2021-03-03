import {Component, HostListener, OnInit} from '@angular/core';
import {Canvas, IEvent, Object as FabricObject} from "fabric/fabric-impl";
import {fabric} from "fabric";
import {EditorService} from "@app/core/editor/editor.service";
import {
  faAlignCenter,
  faCaretSquareLeft,
  faCaretSquareRight,
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
} from "@app/modules/pages/editor/components/simple-actions/simple-actions/alignment.service";
import {CustomImageBox, CustomObject, CustomTextBox} from "@app/core/editor/fabric-object.utils";
import {ObjectPosition} from "@app/core/model/preset";

enum FabricType {
  TEXTBOX = 'textbox',
  IMAGE = 'image'
}

@Component({
  selector: 'app-simple-actions',
  templateUrl: './simple-actions.component.html',
  styleUrls: ['./simple-actions.component.scss']
})
export class SimpleActionsComponent implements OnInit {
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
  objectAlignments = dictToKeys(ObjectAlignments);
  simpleAlignments = SimpleAlignments;


  fabricType = FabricType;
  selectedType: FabricType | null = null;

  ObjectPosition = ObjectPosition;

  /**
   * holds the selected Object, if it is selected
   */
  activeObject: CustomObject | CustomImageBox | CustomTextBox | any = null;

  constructor(private  editorService: EditorService,
              private alignmentService: AlignmentService) {
  }

  ngOnInit(): void {
    // TODO: kill subscription in onDestroy!
    this.editorService.getCanvas().subscribe(canvas => {
      this.canvas = canvas;
      this.canvas.on(
        {
          'selection:created': (event: any) => this.selectionEvent(event),
          'selection:updated': (event: any) => this.selectionEvent(event),
          'selection:cleared': (event: any) => this.selectionEndEvent(event),
        },
      );
    });
  }

  @HostListener('document:keydown.delete', ['$event'])
  keyEventDelete(_event: KeyboardEvent) {
    this.removeActiveObject();
  }

  removeActiveObject() {
    this.canvas.remove(this.activeObject);
  }

  selectionEvent(_e: IEvent) {
    this.activeObject = this.canvas.getActiveObject();
    this.activeObject.set({
      borderColor: '#20bfa9',
      cornerColor: '#20bfa9',
      borderScaleFactor: 2
    });

    if (this.activeObject instanceof fabric.Textbox) {
      this.activeRangeSliderCurrentValue = Number(this.activeObject.fontSize);
      this.activeRangeSliderMax = 300;
      this.selectedType = FabricType.TEXTBOX;
    } else if (this.activeObject instanceof fabric.Image) {
      this.activeRangeSliderCurrentValue = Number(this.activeObject.getScaledWidth());
      this.activeRangeSliderMax = Number(1200);
      this.selectedType = FabricType.IMAGE;
    } else {
      console.error('onCanvasEvent could not found Object:', this.activeObject)
    }
  }

  selectionEndEvent(_e: IEvent & { selected: FabricObject[] }) {
    this.activeObject = null;
    this.selectedType = null;
  }

  changeSize(newWidth: number) {
    const activeObject = this.activeObject;
    if (activeObject instanceof fabric.Textbox) {
      activeObject.fontSize = newWidth;
    } else if (activeObject instanceof fabric.Image) {
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
   * set the position to absolute or relative
   * @param position
   */
  position(position: ObjectPosition) {
    const activeObject = this.activeObject as CustomObject;
    activeObject.presetObjectPosition = position;
  }
}
