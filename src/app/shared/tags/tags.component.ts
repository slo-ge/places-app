import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {map, tap} from "rxjs/operators";
import {Tag} from "../../core/model/tags";
import {TaxonomyService} from "../../core/services/taxonomy.service";
import {QueryParamsHandlerService} from "../../core/services/query-params-handler.service";

export function shuffle(array: any[]) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// TODO calculate
const MAX_COUNTS = 20;
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
    @Input()
    cloudSize: {
        fontMin: number,
        fontMax: number
    } = {
        fontMin: FONT_MIN,
        fontMax: FONT_MAX
    };

    constructor(private taxonomyService: TaxonomyService,
                public queryParamsHandler: QueryParamsHandlerService) {
    }

    ngOnInit(): void {
        // if no tags are set we are going to fetch them directly
        if (!this.tags$) {
            this.tags$ = this.taxonomyService.getTags();
        }

        this.tags$ = this.tags$.pipe(
            tap(tags => tags.sort((a, b) => b.count - a.count)),
            map(data => data.slice(0, 20)),
            tap(tags => this.view === 'cloud' ? shuffle(tags) : tags)
        );
    }

    calculateSize(tag: Tag) {
        return tag.count == MIN_COUNTS
            ? `${this.cloudSize.fontMin}px`
            : `${(tag.count / MAX_COUNTS) * (this.cloudSize.fontMax - this.cloudSize.fontMin) + this.cloudSize.fontMin}px`;
    }
}
