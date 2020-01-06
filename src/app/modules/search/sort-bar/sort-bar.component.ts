import {Component} from '@angular/core';
import {Popover} from "../../../popover/popover/popover.service";
import {SimpleSettingsModalComponent} from "../../../popover/simple-settings-modal/simple-settings-modal.component";


@Component({
    selector: 'app-sort-bar',
    templateUrl: './sort-bar.component.html',
    styleUrls: ['./sort-bar.component.scss']
})
export class SortBarComponent {
    constructor(private popper: Popover) {
    }

    show(origin) {
        this.popper.open({
            content: SimpleSettingsModalComponent,
            origin,
            data: {title: 'Filter'},
            width: '90%'
        });
    }
}
