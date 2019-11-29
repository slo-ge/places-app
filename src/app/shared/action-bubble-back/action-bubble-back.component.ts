import {Component} from '@angular/core';
import {Location} from "@angular/common";
import {Router} from "@angular/router";

@Component({
    selector: 'app-action-bubble-back',
    templateUrl: './action-bubble-back.component.html'
})
export class ActionBubbleBackComponent {

    currentUrl: string = '';

    constructor(private location: Location, private router: Router) {
    }

    back() {
        let path: string[] = this.location.path().split("/");
        path.pop();
        this.router.navigate(this.getCorrectBackPath(path), {queryParamsHandling: 'merge'});
    }

    backUrlMappingTable: { from: string[], to: string[] }[] = [
        {from: ['', 'detail'], to: ['', 'search']}
    ];

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
        for (let mapping of this.backUrlMappingTable) {
            if (mapping.from.sort().toString() === current.sort().toString()) {
                return mapping.to;
            }
            return current;
        }
    }
}
