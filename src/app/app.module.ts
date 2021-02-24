import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ResultListModule} from './modules/pages/result-list/result-list.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {JWTAuthInterceptor} from "@app/core/interceptors/jwtauth.interceptor";
import {PageLayoutsModule} from "@app/modules/page-layouts/page-layouts.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ResultListModule,
    HttpClientModule,
    PageLayoutsModule
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
