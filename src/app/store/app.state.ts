import {Action, Selector, State, StateContext} from '@ngxs/store';
import {SelectGeoLoactionAction, SelectTagAction} from './app.actions';
import {patch} from "@ngxs/store/operators";
import {GeoPosition} from "../core/model/location";
import {Tag} from "../core/model/tags";

export class AppStateModel {
    public geoPosition: GeoPosition;
    public selectedTag: Tag;
}

@State<AppStateModel>({
    name: 'app',
    defaults: {
        geoPosition: null,
        selectedTag: null,
    }
})
export class AppState {

    @Selector()
    static geoPosition(state: AppStateModel) {
        return state.geoPosition;
    }
    @Selector()
    static selectedTag(state: AppStateModel) {
        return state.selectedTag;
    }

    @Action(SelectGeoLoactionAction)
    selectGeoLocation(ctx: StateContext<AppStateModel>, {geoPosition}: SelectGeoLoactionAction) {
        ctx.setState(patch({geoPosition}));
    }

    @Action(SelectTagAction)
    selectTag(ctx: StateContext<AppStateModel>, {tag}: SelectTagAction) {
        ctx.setState(patch({selectedTag: tag}));
    }


}
