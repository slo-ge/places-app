import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SearchRoutingModule} from './search-routing.module';
import {SearchComponent} from './search.component';
import {ResultsComponent} from './results/results.component';
import { SortBarComponent } from './sort-bar/sort-bar.component';


@NgModule({
    declarations: [
        SearchComponent,
        ResultsComponent,
        SortBarComponent
    ],
    imports: [
        CommonModule,
        SearchRoutingModule
    ]
})
export class SearchModule {
}
