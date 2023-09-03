import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatisticsComponent } from '@app/modules/pages/statistics/statistics.component';
import { StatisticsRoutingModule } from '@app/modules/pages/statistics/statistics-routing.module';


@NgModule({
  declarations: [
    StatisticsComponent
  ],
  imports: [
    CommonModule,
    StatisticsRoutingModule
  ]
})
export class StatisticsModule { }
