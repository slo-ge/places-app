import {Component, Input, OnInit} from '@angular/core';
import {ACFLocation} from "../../../core/model/location";
import {calculateDistance} from "../../../core/services/geo-location.service";
import {WpEmbed} from "../../../core/model/embed";
import {getFeaturedImage} from "../../../core/utils/media";

interface GeoPosition {
  lat: number;
  lng: number
}


@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss']
})
export class PlaceComponent implements OnInit {

  @Input()
  place: ACFLocation;

  constructor() { }

  ngOnInit() {
  }

  calcDistance(location: ACFLocation, myPos: GeoPosition) {
    return calculateDistance(
        location.acf.place.lat,
        myPos.lat,
        location.acf.place.lng,
        myPos.lng
    )
  }

  getFeatureImage(embedded: WpEmbed) {
    return getFeaturedImage(embedded);
  }

}
