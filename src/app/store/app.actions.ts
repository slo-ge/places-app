import {GeoPosition} from "../core/model/location";

export class AppAction {
  static readonly type = '[App] Add item';
  constructor(public payload: string) { }
}

export class SelectGeoLoactionAction {
  static readonly  type = '[User] Add Geoloaction'
  constructor(public geoPosition: GeoPosition) {}
}