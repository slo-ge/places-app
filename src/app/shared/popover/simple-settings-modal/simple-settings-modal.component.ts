import {Component, OnInit} from '@angular/core';
import {map} from "rxjs/operators";
import {SortType} from "../../../modules/search/results/results.component";
import {Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {TaxonomyService} from "../../../core/services/taxonomy.service";

@Component({
    selector: 'app-simple-settings-modal',
    templateUrl: './simple-settings-modal.component.html',
    styleUrls: ['./simple-settings-modal.component.scss', './animation.scss']
})
export class SimpleSettingsModalComponent implements OnInit {
    Sort = SortType;
    activeSort$: Observable<SortType>;
    tags$ = this.taxonomyService.getTags();

    constructor(private route: ActivatedRoute,
                private taxonomyService: TaxonomyService) {
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
}
