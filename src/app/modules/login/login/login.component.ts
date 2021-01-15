import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {AuthResponse, LayoutSettingService} from "@app/core/services/layout-setting.service";
import {take} from "rxjs/operators";
import {EMPTY, Observable} from "rxjs";
import {SimpleLocalCacheService} from "@app/core/services/simple-local-cache.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userForm = this.fb.group({
    username: ['',],
    password: ['',],
  });
  show: boolean = false;
  error = '';
  loggedIn: null | string = null;
  currentUser: Observable<AuthResponse | null> = EMPTY;

  constructor(private fb: FormBuilder,
              private authService: LayoutSettingService) {
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
  }

  sendLogin() {
    this.authService.token(
      this.userForm.get('username')?.value,
      this.userForm.get('password')?.value
    ).pipe(take(1)).subscribe(
      _res => {
      },
      err => this.error = err
    )
  }

  toggleLogin() {
    this.show = !this.show;
  }
}
