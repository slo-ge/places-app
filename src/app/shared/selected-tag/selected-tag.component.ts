import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {Tag} from "../../core/model/tags";
import {Select} from "@ngxs/store";
import {AppState} from "../../store/app.state";
import {QueryParamsHandlerService} from "../../core/services/query-params-handler.service";

@Component({
    selector: 'app-selected-tag',
    templateUrl: './selected-tag.component.html',
    styleUrls: ['./selected-tag.component.scss']
})
export class SelectedTagComponent {
    @Select(AppState.selectedTag)
    tag$: Observable<Tag>;

    constructor(public queryParamsHandler: QueryParamsHandlerService) {
    }
}
