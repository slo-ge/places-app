import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {LayoutSettingService} from "@app/core/services/layout-setting.service";
import {take} from "rxjs/operators";

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

  constructor(private fb: FormBuilder,
              private authService: LayoutSettingService) {
  }

  ngOnInit(): void {
  }

  sendLogin() {
    this.authService.auth(
      this.userForm.get('username')?.value,
      this.userForm.get('password')?.value
    ).pipe(take(1)).subscribe(
      _res => {this.show = false; this.loggedIn = _res.user.username},
      err => this.error = err
    )
  }

  toggleLogin() {
    this.show = !this.show;
  }
}
