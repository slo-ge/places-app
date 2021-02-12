import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AppState} from "../../store/app.state";
import {Observable} from "rxjs";
import {Select, Store} from "@ngxs/store";
import {SelectFullTextQuery} from "../../store/app.actions";
import {RouteHandlerService} from "../../core/services/route-handler.service";

@Component({
    selector: 'app-full-text-search',
    templateUrl: './full-text-search.component.html',
    styleUrls: ['./full-text-search.component.scss']
})
export class FullTextSearchComponent implements OnInit {
    @Select(AppState.selectedFullTextQuery)
    queryTextAppState$: Observable<string>;

    queryFullTextFormGroup = new FormGroup({
        queryTextInput: new FormControl(''),
    });

    constructor(private store: Store,
                private queryParamsHandler: RouteHandlerService) {
    }

    // TODO: subscriptions kill
    ngOnInit(): void {
        this.queryTextAppState$.subscribe(text => {
                this.queryFullTextFormGroup.get('queryTextInput').patchValue(text);
            }
        );

        this.queryFullTextFormGroup.get('queryTextInput').valueChanges.subscribe(text => {
            this.store.dispatch(new SelectFullTextQuery(text));
            this.queryParamsHandler.addFullTextQuery(text);
        });
    }

    clear() {
        this.store.dispatch(new SelectFullTextQuery(null));
        this.queryFullTextFormGroup.get('queryTextInput').patchValue(null);
    }
}
