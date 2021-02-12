import {Component, OnInit} from '@angular/core';
import {LoadingService} from "../../core/services/loading.service";
import {Observable} from "rxjs";
import {MainRoutes} from "@places/core/utils/routing";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

    isLoading$: Observable<boolean>;
    readonly MainRoutes = MainRoutes;

    constructor(private loading: LoadingService) {

    }

    ngOnInit(): void {
        this.isLoading$ = this.loading.getLoadingState();
    }
}
