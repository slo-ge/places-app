import {Component, Input} from '@angular/core';
import {Observable} from "rxjs";
import {Tag} from "../../../core/model/tags";
import {Router} from "@angular/router";

@Component({
    selector: 'app-selected-tag',
    templateUrl: './selected-tag.component.html',
    styleUrls: ['./selected-tag.component.scss']
})
export class SelectedTagComponent {
    @Input()
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
