import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormControl } from "@angular/forms";
import { AuthResponse } from "@app/core/services/cms.service";
import { take } from "rxjs/operators";
import { EMPTY, Observable } from "rxjs";
import { CmsAuthService } from "@app/core/services/cms-auth.service";
import { HttpErrorResponse } from '@angular/common/http';


interface LoginError {
    message: {
        messages: {
            id: string;
            message: string;
        }[]
    }[]
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    userForm = this.fb.group({
        username: new UntypedFormControl(''),
        password: new UntypedFormControl('')
    });
    show: boolean = false;
    error: string[] = [];

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
            (err: HttpErrorResponse) => {

                const error: LoginError = err.error;
                this.error = [];
                for (const message of error.message) {
                    for (const innerMessage of message.messages) {
                        this.error.push(innerMessage.message);
                    }
                }
            }
        )
    }
}
