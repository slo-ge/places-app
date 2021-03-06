import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {SearchComponent} from './search.component';
import {SortBarComponent} from "./sort-bar/sort-bar.component";

const routes: Routes = [
    {
        path: '',
        component: SearchComponent
    },
    {
        path: ':slug',
        component: SearchComponent
    },
    {
        path: '',
        component: SortBarComponent,
        outlet: 'sticky-footer'
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SearchRoutingModule {
}
