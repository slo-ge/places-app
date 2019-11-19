import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {map} from "rxjs/operators";
import {SortType} from "../results/results.component";
import {Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {TaxonomyService} from "../../../core/services/taxonomy.service";

@Component({
    selector: 'app-simple-settings-modal',
    templateUrl: './simple-settings-modal.component.html',
    styleUrls: ['./simple-settings-modal.component.scss', './animation.scss']
})
export class SimpleSettingsModalComponent implements OnInit {
    @HostBinding('class.visible')
    @Input()
    show: false;

    @Output()
    closed: EventEmitter<boolean> = new EventEmitter();
    @Output()
    dismissed: EventEmitter<boolean> = new EventEmitter();

    Sort = SortType;
    activeSort$: Observable<SortType>
    tags$ = this.taxonomyService.getTags();

    constructor(private route: ActivatedRoute, private taxonomyService: TaxonomyService) {
    }

    ngOnInit() {
        this.activeSort$ = this.route.queryParams.pipe(
            map(params => {
                if (params.sort && params.sort === SortType.GEO) {
                    return SortType.GEO;
                }
                return SortType.DEFAULT;
            })
        );
    }

    close() {
        this.closed.emit(true);
    }

    dismiss() {
        this.dismissed.emit(true);
    }
}
