import {NgModule} from '@angular/core';
import {DefaultLayoutComponent} from './default-layout/default-layout.component';
import {MainBreadcrumbsModule} from "@app/modules/main-breadcrumbs/main-breadcrumbs.module";
import {LoginModule} from "@app/modules/login/login.module";
import {RouterModule} from "@angular/router";


@NgModule({
  declarations: [DefaultLayoutComponent],
  imports: [
    MainBreadcrumbsModule,
    LoginModule,
    RouterModule
  ]
})
export class PageLayoutsModule { }
