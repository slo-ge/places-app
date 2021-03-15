import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DetailRoutingModule} from './detail-routing.module';
import {DetailComponent} from './detail.component';
import {FooterComponent} from './footer/footer.component';
import {SharedModule} from "../../shared/shared.module";
import {DetailResolver} from "./detail.resolver";
import {PlatformModule} from "@angular/cdk/platform";


@NgModule({
    declarations: [DetailComponent, FooterComponent],
    imports: [
        CommonModule,
        DetailRoutingModule,
        SharedModule,
        PlatformModule
    ],
    providers: [DetailResolver]
})
export class DetailModule {
}
