import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EditorRoutingModule} from './editor-routing.module';
import {EditorComponent} from './editor.component';
import {CanvasComponent} from './components/canvas/canvas.component';
import {LayoutSelectorComponent} from './components/sidebar/layout-selector/layout-selector.component';
import {ReactiveFormsModule} from "@angular/forms";
import {SimpleActionsComponent} from './components/actions/simple-actions/simple-actions.component';
import {RangeSliderComponent} from './components/actions/common/range-slider/range-slider.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {LoadingAnimationModule} from "@app/modules/loading-animation/loading-animation.module";
import {ColorPickerComponent} from './components/actions/common/color-picker/color-picker.component';
import {MetaDataActionsComponent} from './components/sidebar/meta-data-actions/meta-data-actions.component';
import {FontSelectorComponent} from './components/actions/object/font-selector/font-selector.component';
import {FontWeightComponent} from './components/actions/object/font-weight/font-weight.component';
import {FontBackgroundComponent} from './components/actions/object/font-background/font-background.component';
import {FontUnderlineComponent} from './components/actions/object/font-underline/font-underline.component';
import {TabGroupComponent} from './components/sidebar/tab-group/tab-group.component';
import {TabComponent} from "@app/modules/pages/editor/components/sidebar/tab-group/tab.component";
import {LoginModule} from "@app/modules/login/login.module";
import {SharedModule} from "@app/modules/shared/shared.module";
import {PresetTagsComponent} from './components/sidebar/layout-selector/preset-tags/preset-tags.component';
import {MetaDataActionStaticImageComponent} from './components/sidebar/meta-data-action-static-image/meta-data-action-static-image.component';
import {TabDownloadComponent} from '@app/modules/pages/editor/components/sidebar/tab-download/tab-download.component';
import {ZoomComponent} from './components/actions/common/zoom/zoom.component';
import { TextAlignComponent } from './components/actions/object/text-align/text-align.component';
import { ObjectCopyComponent } from './components/actions/object/object-copy/object-copy.component';
import { UndoRedoComponent } from './components/actions/common/undo-redo/undo-redo.component';
import { FeatureComponent } from './components/actions/common/feature/feature.component';
import { ImageFilterComponent } from './components/actions/object/image-filter/image-filter.component';
import {OverlayModule} from "@angular/cdk/overlay";
import { FontColorPickerComponent } from './components/actions/object/font-color-picker/font-color-picker.component';
import { ObjectAlignComponent } from './components/actions/object/object-align/object-align.component';
import { ObjectRotateComponent } from './components/actions/object/object-rotate/object-rotate.component';
import { ObjectRemoveComponent } from './components/actions/object/object-remove/object-remove.component';
import { ObjectSizeComponent } from './components/actions/object/object-size/object-size.component';
import { ObjectShadowComponent } from './components/actions/object/object-shadow/object-shadow.component';
import { ObjectStrokeComponent } from './components/actions/object/object-stroke/object-stroke.component';
import { MultiImageComponent } from './components/sidebar/meta-data-actions/multi-image/multi-image.component';
import { AddShapeComponent } from './components/sidebar/meta-data-actions/add-shape/add-shape.component';
import { ObjectMaskComponent } from './components/actions/object/object-mask/object-mask.component';

@NgModule({
  declarations: [
    EditorComponent,
    CanvasComponent,
    LayoutSelectorComponent,
    SimpleActionsComponent,
    RangeSliderComponent,
    ColorPickerComponent,
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
    MetaDataActionStaticImageComponent,
    ZoomComponent,
    TextAlignComponent,
    ObjectCopyComponent,
    UndoRedoComponent,
    FeatureComponent,
    ImageFilterComponent,
    FontColorPickerComponent,
    ObjectAlignComponent,
    ObjectRotateComponent,
    ObjectRemoveComponent,
    ObjectSizeComponent,
    ObjectShadowComponent,
    ObjectStrokeComponent,
    MultiImageComponent,
    AddShapeComponent,
    ObjectMaskComponent
  ],
	imports: [
		CommonModule,
		EditorRoutingModule,
		ReactiveFormsModule,
		FontAwesomeModule,
		LoadingAnimationModule,
		LoginModule,
		SharedModule,
		OverlayModule
	]
})
export class EditorModule {
}
