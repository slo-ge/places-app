import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorRoutingModule } from './editor-routing.module';
import { EditorComponent } from './editor.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { LayoutSelectorComponent } from './components/layout-selector/layout-selector.component';
import {ReactiveFormsModule} from "@angular/forms";
import { SimpleActionsComponent } from './components/simple-actions/simple-actions.component';
import { RangeSliderComponent } from './components/range-slider/range-slider.component';


@NgModule({
  declarations: [EditorComponent, CanvasComponent, LayoutSelectorComponent, SimpleActionsComponent, RangeSliderComponent],
  imports: [
    CommonModule,
    EditorRoutingModule,
    ReactiveFormsModule
  ]
})
export class EditorModule { }
