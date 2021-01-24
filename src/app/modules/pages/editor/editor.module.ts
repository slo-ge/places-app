import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EditorRoutingModule} from './editor-routing.module';
import {EditorComponent} from './editor.component';
import {CanvasComponent} from './components/canvas/canvas.component';
import {LayoutSelectorComponent} from './components/layout-selector/layout-selector.component';
import {ReactiveFormsModule} from "@angular/forms";
import {SimpleActionsComponent} from './components/simple-actions/simple-actions/simple-actions.component';
import {RangeSliderComponent} from './components/range-slider/range-slider.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {LoadingAnimationModule} from "@app/modules/loading-animation/loading-animation.module";
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { TextSettingsComponent } from './components/simple-actions/simple-actions/text-settings/text-settings.component';
import { MetaDataActionsComponent } from './components/meta-data-actions/meta-data-actions.component';

@NgModule({
  declarations: [
    EditorComponent,
    CanvasComponent,
    LayoutSelectorComponent,
    SimpleActionsComponent,
    RangeSliderComponent,
    ColorPickerComponent,
    TextSettingsComponent,
    MetaDataActionsComponent
  ],
  imports: [
    CommonModule,
    EditorRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    LoadingAnimationModule
  ]
})
export class EditorModule {
}
