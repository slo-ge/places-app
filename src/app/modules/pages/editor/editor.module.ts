import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorRoutingModule } from './editor-routing.module';
import { EditorComponent } from './editor.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { LayoutSelectorComponent } from './components/layout-selector/layout-selector.component';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [EditorComponent, CanvasComponent, LayoutSelectorComponent],
  imports: [
    CommonModule,
    EditorRoutingModule,
    ReactiveFormsModule
  ]
})
export class EditorModule { }
