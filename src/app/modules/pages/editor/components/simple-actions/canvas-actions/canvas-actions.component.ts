import {Component, OnInit} from '@angular/core';
import {fabric} from "fabric";
import {EditorService} from "@app/modules/pages/editor/services/editor.service";
import {take} from "rxjs/operators";
import {Canvas} from "fabric/fabric-impl";

@Component({
  selector: 'app-canvas-actions',
  templateUrl: './canvas-actions.component.html',
  styleUrls: ['./canvas-actions.component.scss']
})
export class CanvasActionsComponent implements OnInit {
  canvas: any | Canvas;

  constructor(private  editorService: EditorService) {
  }

  ngOnInit(): void {
    this.editorService.getCanvas().subscribe(canvas => {
      this.canvas = canvas;
    });
  }


  addNewTextBox() {
    this.canvas.add(new fabric.Textbox(
      'lorem ipsum some text goes here',
      {
        fontSize: 30,
        width: this.canvas.width
      }
    ));
  }
}
