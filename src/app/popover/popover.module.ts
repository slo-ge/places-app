import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PopoverComponent} from "./popover/popover.component";
import {InsidePopoverComponent} from "./inside-popover/inside-popover.component";
import {OverlayModule} from "@angular/cdk/overlay";
import {DefaultPopoverComponent} from './default-popover/default-popover.component';
import {SimpleSettingsModalComponent} from "./simple-settings-modal/simple-settings-modal.component";


@NgModule({
    declarations: [
        PopoverComponent,
        InsidePopoverComponent,
        DefaultPopoverComponent
    ],
    exports: [
        PopoverComponent,
        InsidePopoverComponent,
        DefaultPopoverComponent
    ],
    imports: [
        CommonModule,
        OverlayModule
    ],
    entryComponents: [
        PopoverComponent,
        InsidePopoverComponent,
        DefaultPopoverComponent,
        SimpleSettingsModalComponent
    ]
})
export class PopoverModule {
}
