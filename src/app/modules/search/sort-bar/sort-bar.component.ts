import {Component} from '@angular/core';


@Component({
    selector: 'app-sort-bar',
    templateUrl: './sort-bar.component.html',
    styleUrls: ['./sort-bar.component.scss']
})
export class SortBarComponent {
    modalOpen = false;

    constructor() {
    }

    openModal() {
        this.modalOpen = !this.modalOpen;
    }
}
