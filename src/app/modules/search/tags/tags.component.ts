import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Observable} from "rxjs";
import {Tag} from "../../../core/model/tags";

// TODO calculate
const MAX_COUNTS = 10;
const MIN_COUNTS = 1;

// SIZES
const FONT_MIN = 10;
const FONT_MAX = 30;

@Component({
    selector: 'app-tags',
    templateUrl: './tags.component.html',
    styleUrls: ['./tags.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsComponent {
    @Input()
    tags$: Observable<Tag[]>;
    @Input()
    cloud = false;

    constructor() {
    }

    calculateSize(tag: Tag) {
        return tag.count == MIN_COUNTS
            ? `${FONT_MIN}px`
            : `${(tag.count / MAX_COUNTS) * (FONT_MAX - FONT_MIN) + FONT_MIN}px`;
    }
}
