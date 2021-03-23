import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewsComponent } from './previews/previews.component';
import {LoadingAnimationModule} from "@app/modules/loading-animation/loading-animation.module";



@NgModule({
  declarations: [PreviewsComponent],
  exports: [
    PreviewsComponent
  ],
  imports: [
    CommonModule,
    LoadingAnimationModule
  ]
})
export class PreviewsModule { }
