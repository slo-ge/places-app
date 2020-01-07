import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {PopoverRef} from "../popover/popover-ref";

export interface ToastrData {
    visibleTime?: number;
    message?: string;
    autoClosing?: boolean;
    position?: string;
    routerLink?: string[];
}

@Component({
    selector: 'app-toastr',
    templateUrl: './toastr.component.html',
    styleUrls: ['./toastr.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastrComponent implements OnInit {
    data: ToastrData = {
        autoClosing: true,
        visibleTime: 1500,
        message: 'hello'
    };

    constructor(private popoverRef: PopoverRef<ToastrData>) {
        this.data = {...this.data, ...this.popoverRef.data};
    }

    ngOnInit() {
        setTimeout(() => {
            this.popoverRef.close();
        }, this.data.visibleTime);
    }
}
