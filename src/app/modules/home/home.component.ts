import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {WpObject} from "../../core/model/wpObject";
import {Observable} from "rxjs";
import {WPContentService} from "@places/core/services/wpcontent.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

    constructor(private contentService: WPContentService) {
    }

    homePage$: Observable<WpObject> = null;

    ngOnInit() {
        this.homePage$ = this.contentService.getPageBy('home');
    }
}
