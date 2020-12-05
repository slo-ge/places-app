import {GeoPosition} from "../core/model/wpObject";
import {Tag} from "../core/model/tags";


export class SelectGeoLoactionAction {
  static readonly  type = '[User] Add Geoloaction'
  constructor(public geoPosition: GeoPosition) {}
}

export class SelectTagAction {
  static readonly  type = '[Tag] Select new Tag'
  constructor(public tag: Tag) {}
}

export class SelectFullTextQuery {
    static readonly type = '[FullTextQuery] Select FullText query'

    constructor(public queryFullText: string) {
    }
}
