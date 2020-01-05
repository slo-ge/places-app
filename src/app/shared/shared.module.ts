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


@NgModule({
    declarations: [
        IconComponent,
        ActionBubbleComponent,
        PlaceComponent,
        TagsComponent,
        ActionBubbleBackComponent,
        LoadingComponent,
        SocialShareComponent,
        FavouriteToggleComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ShareModule
    ],
    exports: [
        IconComponent,
        ActionBubbleComponent,
        ActionBubbleBackComponent,
        PlaceComponent,
        TagsComponent,
        LoadingComponent,
        SocialShareComponent,
        FavouriteToggleComponent
    ]
})
export class SharedModule {
}
