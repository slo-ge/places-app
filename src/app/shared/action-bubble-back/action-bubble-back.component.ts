import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {Router} from "@angular/router";
import {MainRoutes} from "@places/core/utils/routing";
import {Store} from "@ngxs/store";
import {AppState} from "@places/store/app.state";

@Component({
    selector: 'app-action-bubble-back',
    templateUrl: './action-bubble-back.component.html'
})
export class ActionBubbleBackComponent implements OnInit {

    currentUrl: string = '';
    currentTag = '';

    constructor(private location: Location, private router: Router, private store: Store) {
    }


    ngOnInit(): void {
        this.currentTag = this.store.selectSnapshot(AppState.selectedTag)?.slug;
    }


    back() {
        let path: string[] = this.location.path().split("/");
        path.pop();
        this.router.navigate(this.getCorrectBackPath(path), {queryParamsHandling: 'merge'});
    }


    /**
     * In some cases we can not go back just one path,
     * If we are just in a place detail, the path is like /detail/{id},
     * there is no /detail/ page, that means that we just redirect to /search/ page
     *
     * // TODO: this works not in every case because we navigate to a place throw any blog post
     * // TODO: we should navigate back to blog
     *
     * @param current, in some cases the remapped Router URL
     */
    getCorrectBackPath(current: string[]) {
        if (!current.includes(MainRoutes.DETAIL)) {
            return current;
        }

        // from detail page to search page
        return this.currentTag ? ['', MainRoutes.SEARCH, this.currentTag] : ['', MainRoutes.SEARCH];
    }
}
