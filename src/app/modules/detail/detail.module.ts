import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DetailRoutingModule} from './detail-routing.module';
import {DetailComponent} from './detail.component';
import {FooterComponent} from './footer/footer.component';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
    declarations: [DetailComponent, FooterComponent],
    imports: [
        CommonModule,
        DetailRoutingModule,
        SharedModule
    ]
})
export class DetailModule {
}
