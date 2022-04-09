import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ACFLocation} from "@places/core/model/wpObject";
import {Observable} from "rxjs";
import {LocationService} from "@places/core/services/location.service";
import {map} from "rxjs/operators";


interface UIRelated {
    name: string;
    slug: string;
    paths: string[];
}

@Component({
    selector: 'app-related-place',
    templateUrl: './related-place.component.html',
    styleUrls: ['./related-place.component.scss']
})
export class RelatedPlaceComponent implements OnChanges {
    @Input()
    current: ACFLocation;

    related$: Observable<UIRelated[]>;

    constructor(private locationService: LocationService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.related$ = this.locationService.getRelatedPlaces(this.current).pipe(
            map(rs => rs.filter(r => r.ID !== this.current.id)),
            map(rs => rs.map(r => ({
                name: r.post_title,
                slug: r.post_name,
                paths: ['/detail', r.post_name]
            })))
        );
    }

}
