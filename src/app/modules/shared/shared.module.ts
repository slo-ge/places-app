import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackDirective } from './directives/track.directive';



@NgModule({
  declarations: [TrackDirective],
  imports: [
    CommonModule
  ],
  exports: [TrackDirective]
})
export class SharedModule { }
