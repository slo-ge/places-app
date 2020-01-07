import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'app-make-favourite-toastr',
    templateUrl: './make-favourite-toastr.component.html',
    styleUrls: ['./make-favourite-toastr.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakeFavouriteToastrComponent {

    constructor() {
    }

}
