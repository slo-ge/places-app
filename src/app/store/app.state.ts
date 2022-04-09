import {Action, Selector, State, StateContext} from '@ngxs/store';
import {SelectFullTextQuery, SelectGeoLoactionAction, SelectTagAction} from './app.actions';
import {patch} from "@ngxs/store/operators";
import {GeoPosition} from "../core/model/wpObject";
import {UITag} from "@places/core/model/tags";

export class AppStateModel {
    public geoPosition: GeoPosition;
    public selectedTag: UITag;
    public queryFullText: string;
}


@State<AppStateModel>({
    name: 'app',
    defaults: {
        geoPosition: null,
        selectedTag: null,
        queryFullText: null
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

    @Selector()
    static selectedFullTextQuery(state: AppStateModel) {
        return state.queryFullText;
    }

    @Action(SelectGeoLoactionAction)
    selectGeoLocation(ctx: StateContext<AppStateModel>, {geoPosition}: SelectGeoLoactionAction) {
        ctx.setState(patch({geoPosition}));
    }

    @Action(SelectTagAction)
    selectTag(ctx: StateContext<AppStateModel>, {tag}: SelectTagAction) {
        ctx.setState(patch({selectedTag: tag}));
    }

    @Action(SelectFullTextQuery)
    selectFullTextQuery(ctx: StateContext<AppStateModel>, {queryFullText}: SelectFullTextQuery) {
        ctx.setState(patch({queryFullText: queryFullText}));
    }
}
