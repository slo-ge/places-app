import {Component, OnInit} from '@angular/core';
import {Select} from "@ngxs/store";
import {ProfileState} from "./store/profile.state";
import {EMPTY, Observable} from "rxjs";
import {ACFLocation} from "../../core/model/wpObject";
import {LocationService} from "../../core/services/location.service";
import {switchMap} from "rxjs/operators";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    @Select(ProfileState.selectName)
    name$: Observable<string>;
    @Select(ProfileState.selectPlaces)
    placeSlugs$: Observable<number[]>;
    places$: Observable<ACFLocation[]>;

    constructor(private locationService: LocationService) {
    }

    ngOnInit() {
        this.places$ = this.placeSlugs$.pipe(
            switchMap((ids) => {
                if (ids.length > 0) {
                    return this.locationService.getPlaceByIds(ids)
                }
                return EMPTY;
            })
        );
    }
}
