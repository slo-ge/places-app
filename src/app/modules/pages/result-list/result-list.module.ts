import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultListRoutingModule } from './result-list-routing.module';
import { ResultListComponent } from './result-list.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {LoadingAnimationModule} from "@app/modules/loading-animation/loading-animation.module";


@NgModule({
  declarations: [ResultListComponent],
  imports: [
    CommonModule,
    ResultListRoutingModule,
    FontAwesomeModule,
    LoadingAnimationModule
  ]
})
export class ResultListModule { }
