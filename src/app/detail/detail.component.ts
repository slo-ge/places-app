import {Component, OnInit} from '@angular/core';
import {LocationService} from "../core/services/location.service";
import {Observable} from "rxjs";
import {ACFLocation} from "../core/model/location";
import {ActivatedRoute} from "@angular/router";
import {map, switchMap} from "rxjs/operators";

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

    constructor(private locationService: LocationService,
                private route: ActivatedRoute) {
    }

    location$: Observable<ACFLocation>;

    ngOnInit() {
        this.location$ = this.route.params.pipe(
            switchMap(params => this.locationService.getPlace(params['slug'])),
            map(places => places[0])
        );
    }
}
