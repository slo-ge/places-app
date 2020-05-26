import {Component, OnInit, ViewChild} from '@angular/core';
import {GoogleMap, MapInfoWindow, MapMarker} from "@angular/google-maps";
import {GeoPosition} from "../../../core/model/wpObject";
import {AppState} from "../../../store/app.state";
import {Select} from "@ngxs/store";
import {combineLatest, Observable, of} from "rxjs";
import {LocationService} from "../../../core/services/location.service";
import {GeoPlace} from "../../../core/model/geo-place";
import {calculateDistance} from "../../../core/services/geo-location.service";
import {map, tap} from "rxjs/operators";
import {MainRoutes} from "../../../core/utils/routing";

interface DistancedGeoPlaces extends GeoPlace {
    distance: number;
}

const GEO_VIENNA = {lng: 16.373371199999998, lat: 48.2187293};

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
    @ViewChild(MapInfoWindow, {static: false})
    infoWindow: MapInfoWindow;
    selection: GeoPlace = null;

    @Select(AppState.geoPosition)
    currentPosition$: Observable<GeoPosition>;

    positionWithFallback$: Observable<GeoPosition>;
    visiblePlaces$: Observable<DistancedGeoPlaces[]>;
    allPlaces: DistancedGeoPlaces[];

    markerOptions: google.maps.MarkerOptions = {
        draggable: false,
        icon: '/assets/marker/restaurant.png'
    };

    youMarker: google.maps.MarkerOptions = {
        draggable: false,
        icon: '/assets/marker/you.png'
    };

    zoom = 15;
    showInRadiusKm = 3;

    readonly DetailPath = MainRoutes.DETAIL;

    constructor(private locationService: LocationService) {

    }

    ngOnInit() {
        this.positionWithFallback$ = this.currentPosition$.pipe(
            map(pos => pos === null ? GEO_VIENNA : pos)
        );
        this.visiblePlaces$ = combineLatest([this.positionWithFallback$, this.locationService.getGeoPlaces()]).pipe(
            map(([position, data]) => data.map(place => this.mapDistancedGeoPlace(place, position))),
            tap(data => this.allPlaces = data),
            map(places => places.filter(place => place.distance < this.showInRadiusKm))
        );
    }

    mapDistancedGeoPlace(geoPlace: GeoPlace, mapPosition: GeoPosition): DistancedGeoPlaces {
        return {
            ...geoPlace,
            distance: calculateDistance(geoPlace.lat, mapPosition.lat, geoPlace.lng, mapPosition.lng)
        }
    }

    /**
     * On dragend event we calculate the new positions of every place and show only the locations
     * which are in the map center.
     * @param event
     */
    dragend(event: GoogleMap) {
        const [lat, lng] = [event.getCenter().lat(), event.getCenter().lng()];

        // fallback if allPlaces are empty
        const allPlaces$ = this.allPlaces
            ? of(this.allPlaces).pipe(tap(data => this.allPlaces = data))
            : this.locationService.getGeoPlaces();

        this.visiblePlaces$ = allPlaces$.pipe(
            map(data => data.map(place => this.mapDistancedGeoPlace(place, {lat, lng}))),
            map(places => places.filter(place => place.distance < this.showInRadiusKm))
        );
    }

    openInfoWindow(marker: MapMarker, geoPlace: GeoPlace) {
        this.selection = geoPlace;
        this.infoWindow.open(marker);
    }

}
