import {Component} from '@angular/core';
import {Select} from "@ngxs/store";
import {AppState} from "../../store/app.state";
import {Observable} from "rxjs";
import {QueryParamsHandlerService} from "../../core/services/query-params-handler.service";

@Component({
    selector: 'app-full-text-search-bubble',
    templateUrl: './full-text-search-bubble.component.html',
    styleUrls: ['./full-text-search-bubble.component.scss']
})
export class FullTextSearchBubbleComponent {
    @Select(AppState.selectedFullTextQuery)
    queryString$: Observable<string>;

    constructor(public queryParamsHandler: QueryParamsHandlerService) {
    }
}
