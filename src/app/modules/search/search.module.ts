import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SearchRoutingModule} from './search-routing.module';
import {SearchComponent} from './search.component';
import {ResultsComponent} from './results/results.component';
import { SortBarComponent } from './sort-bar/sort-bar.component';
import { PlaceComponent } from './place/place.component';
import { PaginationComponent } from './pagination/pagination.component';


@NgModule({
    declarations: [
        SearchComponent,
        ResultsComponent,
        SortBarComponent,
        PlaceComponent,
        PaginationComponent
    ],
    imports: [
        CommonModule,
        SearchRoutingModule
    ]
})
export class SearchModule {
}
