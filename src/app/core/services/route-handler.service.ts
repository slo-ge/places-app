import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {MainRoutes} from "@places/core/utils/routing";

const queryParamsHandling = 'merge';

@Injectable({
    providedIn: 'root'
})
export class RouteHandlerService {
    constructor(private router: Router) {
    }

    addFullTextQuery(queryString: string) {
        this.router.navigate([], {
            queryParams: {
                fullTextQuery: queryString
            },
            queryParamsHandling
        });
    }

    removeFullTextQuery() {
        this.router.navigate([], {
            queryParams: {
                fullTextQuery: null
            },
            queryParamsHandling
        });
    }

    addTagToSearchPath(tag: string) {
        this.router.navigate([`/${MainRoutes.SEARCH}/${tag}`], {queryParamsHandling})
    }

    getSearchPathOfTag(tag) {
        return `/${MainRoutes.SEARCH}/${tag}`;
    }

    getDefaultSearchPathUrl() {
        return `/${MainRoutes.SEARCH}/`;
    }

    removeTagFromSearchPath() {
        this.router.navigate([`/${MainRoutes.SEARCH}/`], {queryParamsHandling});
    }
}
