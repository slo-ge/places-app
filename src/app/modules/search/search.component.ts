import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit{
    view: 'list' | 'map' = 'list';

    constructor(private route: ActivatedRoute,) {
    }

    ngOnInit(): void {
        // TODO:
        this.view = this.route.snapshot.params['view'] ? this.route.snapshot.params['view'] : 'list';
    }
}
