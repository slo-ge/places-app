import {Component, Input} from '@angular/core';
import {Observable} from "rxjs";
import {Tag} from "../../../core/model/tags";

@Component({
    selector: 'app-tags',
    templateUrl: './tags.component.html',
    styleUrls: ['./tags.component.scss']
})
export class TagsComponent {

    @Input()
    tags$: Observable<Tag[]>;

    constructor() {
    }
}
