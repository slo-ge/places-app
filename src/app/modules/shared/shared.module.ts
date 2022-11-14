import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TrackDirective} from './directives/track.directive';
import {FeedbackComponent} from "@app/modules/shared/components/feedback/feedback.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {ReactiveFormsModule} from "@angular/forms";
import {SocalShareComponent} from './components/socal-share/socal-share.component';
import {OverlayMenuComponent} from './components/overlay-menu/overlay-menu.component';
import {OverlayModule} from "@angular/cdk/overlay";
import {ExpansionPanelComponent} from './components/expansion-panel/expansion-panel.component';


@NgModule({
  declarations: [TrackDirective, FeedbackComponent, SocalShareComponent, OverlayMenuComponent, ExpansionPanelComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    OverlayModule
  ],
  exports: [TrackDirective, FeedbackComponent, SocalShareComponent, OverlayMenuComponent, ExpansionPanelComponent]
})
export class SharedModule {
}