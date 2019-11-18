import {GeoPosition} from "../core/model/location";
import {Tag} from "../core/model/tags";


export class SelectGeoLoactionAction {
  static readonly  type = '[User] Add Geoloaction'
  constructor(public geoPosition: GeoPosition) {}
}

export class SelectTagAction {
  static readonly  type = '[Tag] Select new Tag'
  constructor(public tag: Tag) {}
}