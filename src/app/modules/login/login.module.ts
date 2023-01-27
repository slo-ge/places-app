import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import {ReactiveFormsModule} from "@angular/forms";
import { ProfileComponent } from './profile/profile.component';
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [LoginComponent, ProfileComponent],
  exports: [
    LoginComponent,
    ProfileComponent
  ],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		RouterModule
	]
})
export class LoginModule { }
