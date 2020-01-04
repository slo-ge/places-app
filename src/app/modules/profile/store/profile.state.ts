import {Action, Selector, State, StateContext} from '@ngxs/store';
import {RemoveFavouritePlace, SelectFavouritePlaceAction, SelectPlaceAction} from './profile.actions';
import {append, patch, removeItem} from "@ngxs/store/operators";

export class ProfileStateModel {
    public name: string;
    public age: number;
    public places?: number[];
}

@State<ProfileStateModel>({
    name: 'profile',
    defaults: {
        name: 'Random Name',
        age: 35,
        places: []
    }
})
export class ProfileState {

    @Selector()
    static selectName(state: ProfileStateModel) {
        return state.name;
    }

    @Selector()
    static selectAge(state: ProfileStateModel) {
        return state.age;
    }

    @Selector()
    static selectPlaces(state: ProfileStateModel) {
        return state.places;
    }

    @Action(SelectPlaceAction)
    selectPlace(ctx: StateContext<ProfileStateModel>, {place}: SelectPlaceAction) {
        ctx.setState(
            patch({
                places: append([place.id])
            })
        );
    }

    @Action(SelectFavouritePlaceAction)
    addFavouritePlace(ctx: StateContext<ProfileStateModel>, {place}: SelectPlaceAction) {
        ctx.setState(
            patch({
                places: append([place.id])
            })
        );
    }

    @Action(RemoveFavouritePlace)
    removePanda(ctx: StateContext<ProfileStateModel>, {place}: SelectPlaceAction) {
        ctx.setState(
            patch({
                places: removeItem<number>(name => name === place.id)
            })
        );
    }
}
