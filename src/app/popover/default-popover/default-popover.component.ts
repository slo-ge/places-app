import {Component} from '@angular/core';
import {PopoverRef} from "../popover/popover-ref";

@Component({
    selector: 'app-default-popover',
    templateUrl: './default-popover.component.html',
    styleUrls: ['./default-popover.component.scss']
})
export class DefaultPopoverComponent {
    title: string = 'random title';

    constructor(private popoverRef: PopoverRef) {
        this.title = this.popoverRef.data.title;
    }

    close() {
        this.popoverRef.close({id: 1});
    }
}
