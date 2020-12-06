import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainBreadcrumbsComponent } from './main-breadcrumbs.component';
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [MainBreadcrumbsComponent],
  exports: [
    MainBreadcrumbsComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class MainBreadcrumbsModule { }
