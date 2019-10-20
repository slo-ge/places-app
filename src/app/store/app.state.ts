import {Action, Selector, State, StateContext} from '@ngxs/store';
import {SelectGeoLoactionAction} from './app.actions';
import {patch} from "@ngxs/store/operators";
import {GeoPosition} from "../core/model/location";

export class AppStateModel {
    public items: string[];
    public geoPosition: GeoPosition;
}

@State<AppStateModel>({
    name: 'app',
    defaults: {
        items: [],
        geoPosition: null
    }
})
export class AppState {

    @Selector()
    static geoPosition(state: AppStateModel) {
        return state.geoPosition;
    }

    @Action(SelectGeoLoactionAction)
    selectGeoLocation(ctx: StateContext<AppStateModel>, {geoPosition}: SelectGeoLoactionAction) {
        ctx.setState(patch({geoPosition}));
    }

}
