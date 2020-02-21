import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DetailComponent} from './detail.component';
import {FooterComponent} from "./footer/footer.component";

const routes: Routes = [
    {
        path: ':slug',
        component: DetailComponent
    },
    {
        path: '',
        component: FooterComponent,
        outlet: 'sticky-footer'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DetailRoutingModule {
}
