import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { JWTAuthInterceptor } from "@app/core/interceptors/jwtauth.interceptor";
import { PageLayoutsModule } from "@app/modules/page-layouts/page-layouts.module";
import { GoogleAnalyticsService } from "@app/core/services/google-analytics.service";
import { OverlayModule } from '@angular/cdk/overlay';
import * as Sentry from "@sentry/angular";
import { AuthenticatedUserInterceptor } from './core/interceptors/user.interceptor';
import { InitialConfigService } from "@app/core/services/initial-config.service";


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        PageLayoutsModule,
        OverlayModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JWTAuthInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthenticatedUserInterceptor,
            multi: true
        },
        {
            provide: 'googleTagManagerId',
            useValue: 'GTM-KJS779S'
        },
        {
            provide: APP_INITIALIZER,
            useFactory: (service: InitialConfigService) => () => service.fetchInitialConfig(),
            deps: [InitialConfigService],
            multi: true
        },
        {
            provide: APP_INITIALIZER,
            useFactory: (service: GoogleAnalyticsService) => () => service.init(),
            deps: [GoogleAnalyticsService],
            multi: true
        },
        {
            provide: ErrorHandler,
            useValue: Sentry.createErrorHandler({
                showDialog: false
            })
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
