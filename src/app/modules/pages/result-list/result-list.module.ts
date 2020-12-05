import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultListRoutingModule } from './result-list-routing.module';
import { ResultListComponent } from './result-list.component';


@NgModule({
  declarations: [ResultListComponent],
  imports: [
    CommonModule,
    ResultListRoutingModule
  ]
})
export class ResultListModule { }
