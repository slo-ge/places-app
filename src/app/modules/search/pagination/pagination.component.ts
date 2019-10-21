import {Component, OnInit} from '@angular/core';
import {Info, LocationService} from "../../../core/services/location.service";
import {Observable} from "rxjs";

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
    searchInfo$: Observable<Info>;

    constructor(private locationService: LocationService) {
    }

    ngOnInit() {
        this.searchInfo$ = this.locationService.getInfo();
    }
}
