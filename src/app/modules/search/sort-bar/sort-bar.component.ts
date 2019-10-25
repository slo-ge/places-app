import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {SortType} from "../results/results.component";


@Component({
    selector: 'app-sort-bar',
    templateUrl: './sort-bar.component.html',
    styleUrls: ['./sort-bar.component.scss']
})
export class SortBarComponent implements OnInit {
    constructor(private route: ActivatedRoute) {
    }

    Sort = SortType;
    activeSort$: Observable<SortType>

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
