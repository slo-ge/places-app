import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingAnimationComponent } from './loading-animation/loading-animation.component';



@NgModule({
  declarations: [LoadingAnimationComponent],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingAnimationComponent
  ]
})
export class LoadingAnimationModule { }
