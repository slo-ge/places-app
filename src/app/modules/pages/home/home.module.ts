import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import {ReactiveFormsModule} from "@angular/forms";
import {LoadingAnimationModule} from "@app/modules/loading-animation/loading-animation.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";


@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    LoadingAnimationModule,
    FontAwesomeModule
  ]
})
export class HomeModule { }
