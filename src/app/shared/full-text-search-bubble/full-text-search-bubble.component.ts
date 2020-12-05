import {Component} from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {Observable} from "rxjs";
import {AppState} from "@places/store/app.state";
import {QueryParamsHandlerService} from "@places/core/services/query-params-handler.service";
import {SelectFullTextQuery} from "@places/store/app.actions";

@Component({
    selector: 'app-full-text-search-bubble',
    templateUrl: './full-text-search-bubble.component.html',
    styleUrls: ['./full-text-search-bubble.component.scss']
})
export class FullTextSearchBubbleComponent {
    @Select(AppState.selectedFullTextQuery)
    queryString$: Observable<string>;

    constructor(public queryParamsHandler: QueryParamsHandlerService,
                private store: Store) {
    }

    removeFromState() {
        this.store.dispatch(new SelectFullTextQuery(null));
    }
}
