import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {Tag} from "../../core/model/tags";
import {Router} from "@angular/router";
import {Select} from "@ngxs/store";
import {AppState} from "../../store/app.state";

@Component({
    selector: 'app-selected-tag',
    templateUrl: './selected-tag.component.html',
    styleUrls: ['./selected-tag.component.scss']
})
export class SelectedTagComponent {
    @Select(AppState.selectedTag)
    tag$: Observable<Tag>;

    constructor(private router: Router) {
    }

    removeTag() {
        this.router.navigate([], {
            queryParams: {
                tags: null
            },
            queryParamsHandling: 'merge'
        });
    }

}
