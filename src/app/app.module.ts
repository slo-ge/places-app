import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ResultListModule} from './modules/pages/result-list/result-list.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {JWTAuthInterceptor} from "@app/core/interceptors/jwtauth.interceptor";
import {PageLayoutsModule} from "@app/modules/page-layouts/page-layouts.module";
import {GoogleAnalyticsService} from "@app/core/services/google-analytics.service";
import {OverlayModule} from '@angular/cdk/overlay';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ResultListModule,
    HttpClientModule,
    PageLayoutsModule,
    OverlayModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JWTAuthInterceptor,
      multi: true
    },
    {
      provide: 'googleTagManagerId',
      useValue: 'GTM-KJS779S'
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (service: GoogleAnalyticsService) => () => service.init(),
      deps: [GoogleAnalyticsService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
