import {Component, Input, OnInit} from '@angular/core';
import {ACFLocation} from "../../core/model/wpObject";
import {ToggleFavouritePlace} from "../../modules/profile/store/profile.actions";
import {Select, Store} from "@ngxs/store";
import {ProfileState} from "../../modules/profile/store/profile.state";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Popover} from "../popover/popover/popover.service";
import {ToastrData} from "../popover/toastr/toastr.component";
import {MakeFavouriteToastrComponent} from "../popover/toastr/make-favourite-toastr/make-favourite-toastr.component";

@Component({
    selector: 'app-favourite-toggle',
    templateUrl: './favourite-toggle.component.html',
    styleUrls: ['./favourite-toggle.component.scss']
})
export class FavouriteToggleComponent implements OnInit {
    @Input()
    place: ACFLocation;

    @Select(ProfileState.selectPlaces)
    favouritePlaces$: Observable<number[]>;
    isFav$: Observable<boolean>;

    constructor(private store: Store, private popper: Popover) {
    }

    ngOnInit(): void {
        this.isFav$ = this.favouritePlaces$.pipe(
            map(places => {
                return places.includes(this.place.id)
            })
        );
    }

    toggle(origin, checked) {
        this.store.dispatch(new ToggleFavouritePlace(this.place));

        const message = checked
            ? `Remove <b>${this.place.title.rendered}</b> from loved places.`
            : `Add <b>${this.place.title.rendered}</b> to loved places.`;

        this.popper.open<ToastrData>({
            content: MakeFavouriteToastrComponent,
            origin,
            data: {message},
            width: '90%'
        });
    }
}
