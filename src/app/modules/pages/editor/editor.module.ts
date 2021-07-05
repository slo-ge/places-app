import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorRoutingModule } from './editor-routing.module';
import { EditorComponent } from './editor.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { LayoutSelectorComponent } from './components/sidebar/layout-selector/layout-selector.component';
import { ReactiveFormsModule } from "@angular/forms";
import { SimpleActionsComponent } from './components/actions/simple-actions/simple-actions/simple-actions.component';
import { RangeSliderComponent } from './components/actions/range-slider/range-slider.component';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { LoadingAnimationModule } from "@app/modules/loading-animation/loading-animation.module";
import { ColorPickerComponent } from './components/actions/color-picker/color-picker.component';
import { TextSettingsComponent } from './components/actions/simple-actions/simple-actions/text-settings/text-settings.component';
import { MetaDataActionsComponent } from './components/sidebar/meta-data-actions/meta-data-actions.component';
import { FontSelectorComponent } from './components/actions/font-selector/font-selector.component';
import { FontWeightComponent } from './components/actions/font-weight/font-weight.component';
import { FontBackgroundComponent } from './components/actions/font-background/font-background.component';
import { FontUnderlineComponent } from './components/actions/font-underline/font-underline.component';
import { TabGroupComponent } from './components/sidebar/tab-group/tab-group.component';
import { TabComponent } from "@app/modules/pages/editor/components/sidebar/tab-group/tab.component";
import { LoginModule } from "@app/modules/login/login.module";
import { SharedModule } from "@app/modules/shared/shared.module";
import { PresetTagsComponent } from './components/sidebar/layout-selector/preset-tags/preset-tags.component';
import { MetaDataActionStaticImageComponent } from './components/sidebar/meta-data-action-static-image/meta-data-action-static-image.component';
import { TabDownloadComponent } from '@app/modules/pages/editor/components/sidebar/tab-download/tab-download.component';

@NgModule({
    declarations: [
        EditorComponent,
        CanvasComponent,
        LayoutSelectorComponent,
        SimpleActionsComponent,
        RangeSliderComponent,
        ColorPickerComponent,
        TextSettingsComponent,
        MetaDataActionsComponent,
        FontSelectorComponent,
        FontWeightComponent,
        TabDownloadComponent,
        FontBackgroundComponent,
        FontUnderlineComponent,
        TabGroupComponent,
        TabGroupComponent,
        TabComponent,
        PresetTagsComponent,
        MetaDataActionStaticImageComponent
    ],
    imports: [
        CommonModule,
        EditorRoutingModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        LoadingAnimationModule,
        LoginModule,
        SharedModule
    ]
})
export class EditorModule {
}
