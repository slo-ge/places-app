import {NgModule} from '@angular/core';
import {DefaultLayoutComponent} from './default-layout/default-layout.component';
import {LoginModule} from "@app/modules/login/login.module";
import {RouterModule} from "@angular/router";
import {SharedModule} from "@app/modules/shared/shared.module";


@NgModule({
  declarations: [DefaultLayoutComponent],
  imports: [
    LoginModule,
    RouterModule,
    SharedModule
  ]
})
export class PageLayoutsModule { }
