import {Component, Input, OnInit} from '@angular/core';
import {ACFLocation, GeoPosition} from "../../core/model/wpObject";
import {calculateDistance} from "../../core/services/geo-location.service";
import {getFeaturedImage} from "../../core/utils/media";
import {Select} from "@ngxs/store";
import {AppState} from "../../store/app.state";
import {Observable} from "rxjs";
import {TaxonomyService} from "../../core/services/taxonomy.service";
import {WPTag} from "../../core/model/tags";
import {getGoogleMapRoute} from "@places/core/utils/maps";

@Component({
    selector: 'app-place',
    templateUrl: './place.component.html',
    styleUrls: ['./place.component.scss']
})
export class PlaceComponent implements OnInit {
    @Select(AppState.geoPosition)
    geoPosition$: Observable<GeoPosition>;

    @Input()
    place: ACFLocation;

    tags$: Observable<WPTag[]>;
    featureImageUrl: string;
    detailPagePaths: string[];
    geoUrl: string;

    constructor(private taxonomyService: TaxonomyService) {
    }

    ngOnInit() {
        this.tags$ = this.taxonomyService.getNamesFromId(this.place.tags);
        this.featureImageUrl = getFeaturedImage(this.place._embedded);
        this.detailPagePaths = ['/detail', this.place.slug];
        this.geoUrl = getGoogleMapRoute(this.place);
    }

    calcDistance(location: ACFLocation, myPos: GeoPosition) {
        return calculateDistance(
            location.acf.place.lat,
            myPos.lat,
            location.acf.place.lng,
            myPos.lng
        )
    }

}
