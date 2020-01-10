import {Component, Inject, OnInit} from '@angular/core';
import {WpObject} from "../../core/model/wpObject";
import {Observable} from "rxjs";
import {CONTENT_SERVICE, ContentService} from "../../core/model/content.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(@Inject(CONTENT_SERVICE) private contentService: ContentService) {
        console.log(contentService);
    }

    homePage$: Observable<WpObject>;

    ngOnInit() {
        this.homePage$ = this.contentService.getPageBy('home');
    }

}
