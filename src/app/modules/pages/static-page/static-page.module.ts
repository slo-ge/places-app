import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaticPageRoutingModule } from './static-page-routing.module';
import { StaticPageComponent } from './static-page.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {LoadingAnimationModule} from "@app/modules/loading-animation/loading-animation.module";


@NgModule({
  declarations: [StaticPageComponent],
  imports: [
    CommonModule,
    StaticPageRoutingModule,
    FontAwesomeModule,
    LoadingAnimationModule
  ]
})
export class StaticPageModule { }
