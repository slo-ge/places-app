import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RenderComponent } from './render/render.component';
import {RenderRoutingModule} from "@app/modules/pages/render/render-routing.module";


@NgModule({
  declarations: [RenderComponent],
  imports: [
    CommonModule,
    RenderRoutingModule
  ]
})
export class RenderModule { }
