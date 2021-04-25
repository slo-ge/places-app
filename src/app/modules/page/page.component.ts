import {Component, OnInit} from '@angular/core';
import {WPContentService} from "@places/core/services/wpcontent.service";
import {Observable} from "rxjs";
import {WpObject} from "@places/core/model/wpObject";
import {ActivatedRoute} from "@angular/router";
import {mergeMap} from "rxjs/operators";

@Component({
    selector: 'app-page',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
    page$: Observable<WpObject> = null;


    constructor(private contentService: WPContentService,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.page$ = this.route.params.pipe(
            mergeMap(params => {
                if (params['pageSlug']) {
                    return this.contentService.getPageBy(params['pageSlug']);
                } else {
                    return this.contentService.getPageBy('home');
                }
            })
        );
    }
}
