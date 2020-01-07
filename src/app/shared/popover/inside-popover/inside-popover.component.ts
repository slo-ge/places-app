import {Component} from '@angular/core';
import {PopoverRef} from '../popover/popover-ref';

@Component({
    templateUrl: './inside-popover.component.html',
    styleUrls: ['./inside-popover.component.scss']
})
export class InsidePopoverComponent {
    skills;

    constructor(private popoverRef: PopoverRef) {
        this.skills = this.popoverRef.data.skills;
    }

    close() {
        this.popoverRef.close({id: 1});
    }
}
