import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SearchRoutingModule} from './search-routing.module';
import {SearchComponent} from './search.component';
import {ResultsComponent} from './results/results.component';
import {SortBarComponent} from './sort-bar/sort-bar.component';
import {PaginationComponent} from './pagination/pagination.component';
import {SharedModule} from "../../shared/shared.module";
import {SelectedTagComponent} from './selected-tag/selected-tag.component';
import {SimpleSettingsModalComponent} from '../../popover/simple-settings-modal/simple-settings-modal.component';
import {PopoverModule} from "../../popover/popover.module";


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
        SharedModule,
        PopoverModule
    ]
})
export class SearchModule {
}
