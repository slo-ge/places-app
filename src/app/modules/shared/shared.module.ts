import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackDirective } from './directives/track.directive';
import {FeedbackComponent} from "@app/modules/shared/components/feedback/feedback.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {ReactiveFormsModule} from "@angular/forms";
import { SocalShareComponent } from './components/socal-share/socal-share.component';



@NgModule({
  declarations: [TrackDirective, FeedbackComponent, SocalShareComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ],
  exports: [TrackDirective, FeedbackComponent, SocalShareComponent]
})
export class SharedModule { }
