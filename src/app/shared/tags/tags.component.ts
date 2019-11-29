import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {map, tap} from "rxjs/operators";
import {Tag} from "../../core/model/tags";

// TODO calculate
const MAX_COUNTS = 30;
const MIN_COUNTS = 1;

// SIZES
const FONT_MIN = 10;
const FONT_MAX = 20;

@Component({
    selector: 'app-tags',
    templateUrl: './tags.component.html',
    styleUrls: ['./tags.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsComponent implements OnInit {
    @Input()
    tags$: Observable<Tag[]>;
    @Input()
    view: 'hash' | 'cloud' | 'list' = 'hash';

    constructor() {
    }

    ngOnInit(): void {
        if (this.view === 'list') {
            this.tags$ = this.tags$.pipe(
                tap(tags => tags.sort((a, b) => b.count - a.count)),
                map(data => data.slice(0, 20))
            );
        }
    }

    calculateSize(tag: Tag) {
        return tag.count == MIN_COUNTS
            ? `${FONT_MIN}px`
            : `${(tag.count / MAX_COUNTS) * (FONT_MAX - FONT_MIN) + FONT_MIN}px`;
    }
}
