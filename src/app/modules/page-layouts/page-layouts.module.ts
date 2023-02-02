import { NgModule } from '@angular/core';
import { DefaultLayoutComponent } from './default-layout/default-layout.component';
import { RouterModule } from "@angular/router";
import { CustomOverlayModule } from "@app/modules/overlay/custom-overlay.module";
import { NgIf } from '@angular/common';
import { ImprintComponent } from '@app/standalones/imprint/imprint.component';


@NgModule({
    declarations: [DefaultLayoutComponent],
    imports: [
        RouterModule,
        CustomOverlayModule,
        NgIf,
        ImprintComponent
    ]
})
export class PageLayoutsModule {
}
