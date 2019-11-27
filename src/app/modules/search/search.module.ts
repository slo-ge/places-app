import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SearchRoutingModule} from './search-routing.module';
import {SearchComponent} from './search.component';
import {ResultsComponent} from './results/results.component';
import {SortBarComponent} from './sort-bar/sort-bar.component';
import {PlaceComponent} from '../../shared/place/place.component';
import {PaginationComponent} from './pagination/pagination.component';
import {SharedModule} from "../../shared/shared.module";
import {TagsComponent} from './tags/tags.component';
import {SelectedTagComponent} from './selected-tag/selected-tag.component';
import {SimpleSettingsModalComponent} from './simple-settings-modal/simple-settings-modal.component';


@NgModule({
  declarations: [
    SearchComponent,
    ResultsComponent,
    SortBarComponent,
    PlaceComponent,
    PaginationComponent,
    TagsComponent,
    SelectedTagComponent,
    SimpleSettingsModalComponent
  ],
  exports: [
    PlaceComponent,
    TagsComponent
  ],
  imports: [
    CommonModule,
    SearchRoutingModule,
    SharedModule
  ]
})
export class SearchModule {
}
