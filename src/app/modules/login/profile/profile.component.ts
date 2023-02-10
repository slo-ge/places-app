import { Component, OnInit } from '@angular/core';
import { AuthResponse } from "@app/core/services/cms.service";
import { EMPTY, Observable } from "rxjs";
import { CmsAuthService } from "@app/core/services/cms-auth.service";


@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    currentUser$: Observable<AuthResponse | null> = EMPTY;

    locationReload = () => location.reload();

    constructor(private authService: CmsAuthService) {
    }

    ngOnInit(): void {
        this.currentUser$ = this.authService.getUser();
    }

    logout() {
        this.authService.logout();
    }
}
