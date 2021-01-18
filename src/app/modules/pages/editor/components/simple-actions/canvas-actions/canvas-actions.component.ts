import {Component, OnInit} from '@angular/core';
import {fabric} from "fabric";
import {EditorService} from "@app/modules/pages/editor/services/editor.service";
import {Canvas} from "fabric/fabric-impl";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-canvas-actions',
  templateUrl: './canvas-actions.component.html',
  styleUrls: ['./canvas-actions.component.scss']
})
export class CanvasActionsComponent implements OnInit {
  canvas: any | Canvas;
  iconPlus = faPlus;

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
