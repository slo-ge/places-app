import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ResultListModule } from './modules/pages/result-list/result-list.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MainBreadcrumbsModule} from "@app/modules/main-breadcrumbs/main-breadcrumbs.module";
import {LoginModule} from "@app/modules/login/login.module";
import {JWTAuthInterceptor} from "@app/core/interceptors/jwtauth.interceptor";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ResultListModule,
    HttpClientModule,
    MainBreadcrumbsModule,
    LoginModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JWTAuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
