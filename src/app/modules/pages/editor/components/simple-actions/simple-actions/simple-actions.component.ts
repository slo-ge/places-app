import {Component, HostListener, OnInit} from '@angular/core';
import {Canvas, IEvent, Object} from "fabric/fabric-impl";
import {fabric} from "fabric";
import {EditorService} from "@app/modules/pages/editor/editor.service";
import {take} from "rxjs/operators";
import {
  faAlignCenter,
  faGripLines,
  faGripLinesVertical,
  faRemoveFormat,
  faTrashAlt
} from "@fortawesome/free-solid-svg-icons";


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
  iconCenterHorizontal = faAlignCenter;
  iconCenterVertical = faGripLines;


  constructor(private  editorService: EditorService) {
  }

  ngOnInit(): void {
    this.editorService.getCanvas().subscribe(canvas => {
      this.canvas = canvas;
      this.canvas.on(
        {
          'selection:created': (event: any) => this.onCanvasEvent(event),
          'selection:updated': (event: any) => this.onCanvasEvent(event)
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

  onCanvasEvent(e: IEvent & { selected: Object[] }) {
    const activeObject = e.selected[0];
    if (activeObject instanceof fabric.Textbox) {
      console.log('selected Textbox');
      this.activeRangeSliderCurrentValue = Number(activeObject.fontSize);
      this.activeRangeSliderMax = 300;
    } else if (activeObject instanceof fabric.Image) {
      console.log('selected Image');
      this.activeRangeSliderCurrentValue = Number(activeObject.getScaledWidth());
      this.activeRangeSliderMax = Number(1200);
    } else {
      console.error('onCanvasEvent could not found Object:', activeObject)
    }
  }

  actionCenterV() {
    this.canvas.getActiveObject().centerV();
  }

  actionCenterH() {
    this.canvas.getActiveObject().centerH();
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
}
