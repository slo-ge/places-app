import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IconComponent} from "./icon/icon.component";
import {ActionBubbleComponent} from './action-bubble/action-bubble.component';
import {PlaceComponent} from "./place/place.component";
import {RouterModule} from "@angular/router";
import {TagsComponent} from "./tags/tags.component";
import {ActionBubbleBackComponent} from './action-bubble-back/action-bubble-back.component';
import {LoadingComponent} from './loading/loading.component';


@NgModule({
    declarations: [
        IconComponent,
        ActionBubbleComponent,
        PlaceComponent,
        TagsComponent,
        ActionBubbleBackComponent,
        LoadingComponent
    ],
    imports: [
        CommonModule,
        RouterModule
    ],
    exports: [
        IconComponent,
        ActionBubbleComponent,
        ActionBubbleBackComponent,
        PlaceComponent,
        TagsComponent,
        LoadingComponent
    ]
})
export class SharedModule {
}
