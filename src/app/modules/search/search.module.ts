import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SearchRoutingModule} from './search-routing.module';
import {SearchComponent} from './search.component';
import {ResultsComponent} from './results/results.component';
import {SortBarComponent} from './sort-bar/sort-bar.component';
import {PaginationComponent} from './pagination/pagination.component';
import {SharedModule} from "../../shared/shared.module";
import {SelectedTagComponent} from './selected-tag/selected-tag.component';
import {SimpleSettingsModalComponent} from './simple-settings-modal/simple-settings-modal.component';


@NgModule({
  declarations: [
    SearchComponent,
    ResultsComponent,
    SortBarComponent,
    PaginationComponent,
    SelectedTagComponent,
    SimpleSettingsModalComponent
  ],
  imports: [
    CommonModule,
    SearchRoutingModule,
    SharedModule
  ]
})
export class SearchModule {
}
