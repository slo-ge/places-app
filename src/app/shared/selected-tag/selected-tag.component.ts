import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {Select, Store} from "@ngxs/store";
import {AppState} from "@places/store/app.state";
import {Tag} from "@places/core/model/tags";
import {RouteHandlerService} from "@places/core/services/route-handler.service";
import {SelectTagAction} from "@places/store/app.actions";

@Component({
    selector: 'app-selected-tag',
    templateUrl: './selected-tag.component.html',
    styleUrls: ['./selected-tag.component.scss']
})
export class SelectedTagComponent {
    @Select(AppState.selectedTag)
    tag$: Observable<Tag>;

    constructor(public queryParamsHandler: RouteHandlerService, private store: Store) {
    }

    removeTagFromState() {
        this.store.dispatch(new SelectTagAction(null));
    }
}
