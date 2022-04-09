import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DetailRoutingModule} from './detail-routing.module';
import {DetailComponent} from './detail.component';
import {FooterComponent} from './footer/footer.component';
import {SharedModule} from "../../shared/shared.module";
import {DetailResolver} from "./detail.resolver";
import {RelatedPlaceComponent} from './related-place/related-place.component';

@NgModule({
    declarations: [DetailComponent, FooterComponent, RelatedPlaceComponent],
    imports: [
        CommonModule,
        DetailRoutingModule,
        SharedModule
    ],
    providers: [DetailResolver]
})
export class DetailModule {
}
