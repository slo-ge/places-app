import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IconComponent} from "./icon/icon.component";
import {ActionBubbleComponent} from './action-bubble/action-bubble.component';
import {PlaceComponent} from "./place/place.component";
import {RouterModule} from "@angular/router";
import {TagsComponent} from "./tags/tags.component";
import {ActionBubbleBackComponent} from './action-bubble-back/action-bubble-back.component';
import {LoadingComponent} from './loading/loading.component';
import {SocialShareComponent} from './social-share/social-share.component';
import {ShareModule} from "@ngx-share/core";
import {FavouriteToggleComponent} from './favourite-toggle/favourite-toggle.component';
import {SelectedTagComponent} from "./selected-tag/selected-tag.component";
import {PopoverComponent} from "./popover/popover/popover.component";
import {InsidePopoverComponent} from "./popover/inside-popover/inside-popover.component";
import {DefaultPopoverComponent} from "./popover/default-popover/default-popover.component";
import {ToastrComponent} from "./popover/toastr/toastr.component";
import {OverlayModule} from "@angular/cdk/overlay";
import {SimpleSettingsModalComponent} from "./popover/simple-settings-modal/simple-settings-modal.component";


@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ShareModule,
        OverlayModule
    ],
    declarations: [
        IconComponent,
        ActionBubbleComponent,
        PlaceComponent,
        TagsComponent,
        ActionBubbleBackComponent,
        LoadingComponent,
        SocialShareComponent,
        FavouriteToggleComponent,
        SelectedTagComponent,
        PopoverComponent,
        InsidePopoverComponent,
        DefaultPopoverComponent,
        SimpleSettingsModalComponent,
        ToastrComponent
    ],
    exports: [
        IconComponent,
        ActionBubbleComponent,
        ActionBubbleBackComponent,
        PlaceComponent,
        TagsComponent,
        LoadingComponent,
        SocialShareComponent,
        FavouriteToggleComponent,
        SelectedTagComponent
    ],
    entryComponents: [
        PopoverComponent,
        SimpleSettingsModalComponent,
        ToastrComponent
    ]
})
export class SharedModule {
}
