import {ACFLocation} from "../../../core/model/wpObject";

// TODO: rename
export class SelectPlaceAction {
    static readonly type = '[Select Place] Select new Tag'

    constructor(public place: ACFLocation) {
    }
}

// TODO: rename
export class SelectFavouritePlaceAction {
    static readonly type = '[Add Favourite] add new Favourite Place'

    constructor(public place: ACFLocation) {
    }
}

export class RemoveFavouritePlace {
    static readonly type = '[Remove Favourite] remove favorite Place'

    constructor(public place: ACFLocation) {
    }
}
