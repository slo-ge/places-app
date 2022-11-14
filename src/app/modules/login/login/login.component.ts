import {Component, OnInit} from '@angular/core';
import {FormBuilder, UntypedFormControl} from "@angular/forms";
import {AuthResponse, CmsService} from "@app/core/services/cms.service";
import {take} from "rxjs/operators";
import {EMPTY, Observable} from "rxjs";
import {SimpleLocalCacheService} from "@app/core/services/simple-local-cache.service";
import {CmsAuthService} from "@app/core/services/cms-auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userForm = this.fb.group({
    username: new UntypedFormControl(''),
    password: new UntypedFormControl(''),
  });
  show: boolean = false;
  error = '';
  currentUser: Observable<AuthResponse | null> = EMPTY;

  constructor(private fb: FormBuilder,
              private authService: CmsAuthService) {
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
