import {Component, HostListener, OnInit} from '@angular/core';
import {Canvas, IEvent, Object as FabricObject} from "fabric/fabric-impl";
import {fabric} from "fabric";
import {EditorService} from "@app/modules/pages/editor/services/editor.service";
import {
  faAlignCenter,
  faCaretSquareLeft,
  faCaretSquareRight,
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
  iconRasta = faTh;
  objectAlignments = dictToKeys(ObjectAlignments);
  simpleAlignments = SimpleAlignments;
  showActiveObjectActions = false;

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
    this.canvas.remove(this.canvas.getActiveObject());
  }

  selectionEvent(e: IEvent & { selected: FabricObject[] }) {
    this.showActiveObjectActions = true;

    const activeObject = e.selected[0];
    if (activeObject instanceof fabric.Textbox) {
      this.activeRangeSliderCurrentValue = Number(activeObject.fontSize);
      this.activeRangeSliderMax = 300;
    } else if (activeObject instanceof fabric.Image) {
      this.activeRangeSliderCurrentValue = Number(activeObject.getScaledWidth());
      this.activeRangeSliderMax = Number(1200);
    } else {
      console.error('onCanvasEvent could not found Object:', activeObject)
    }
  }

  selectionEndEvent(_e: IEvent & { selected: FabricObject[] }) {
    this.showActiveObjectActions = false;
  }

  changeSize(newWidth: number) {
    const activeObject = this.canvas.getActiveObject();
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
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      activeObject.centeredRotation = true;
      activeObject.rotate(activeObject.angle + 90);
      this.canvas.renderAll();
    }
  }

  alignmentAction(aligner: ObjectAlignments | SimpleAlignments) {
    this.alignmentService.move(aligner, this.canvas, this.canvas.getActiveObject());
  }
}
