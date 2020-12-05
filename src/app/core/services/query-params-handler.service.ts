import {Injectable} from '@angular/core';
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class QueryParamsHandlerService {
    constructor(private router: Router) {
    }

    addFullTextQuery(queryString: string) {
        this.router.navigate([], {
            queryParams: {
                fullTextQuery: queryString
            },
            queryParamsHandling: 'merge'
        });
    }

    removeFullTextQuery() {
        this.router.navigate([], {
            queryParams: {
                fullTextQuery: null
            },
            queryParamsHandling: 'merge'
        });
    }

    addTag(tag: number) {
        this.router.navigate([], {
            queryParams: {
                tags: tag
            },
            queryParamsHandling: 'merge'
        });
    }

    removeTag() {
        this.router.navigate([], {
            queryParams: {
                tags: null
            },
            queryParamsHandling: 'merge'
        });
    }
}
