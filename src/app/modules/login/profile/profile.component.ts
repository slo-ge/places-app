import {Component, OnInit} from '@angular/core';
import {AuthResponse} from "@app/core/services/cms.service";
import {EMPTY, Observable} from "rxjs";
import {CmsAuthService} from "@app/core/services/cms-auth.service";
import {CookieService} from "@app/core/services/cookie.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser$: Observable<AuthResponse | null> = EMPTY;

  constructor(private authService: CmsAuthService,
              public cookieService: CookieService) {
  }

  ngOnInit(): void {
    this.currentUser$ = this.authService.getUser();
  }

  logout() {
    this.authService.logout();
  }

  toggleCookies() {
    if (this.cookieService.isTrackingDisabled()) {
      this.cookieService.enableCookies();
    } else {
      this.cookieService.disableCookies();
    }
  }
}
