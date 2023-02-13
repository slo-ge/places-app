import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { JWTAuthInterceptor } from "@app/core/interceptors/jwtauth.interceptor";
import { PageLayoutsModule } from "@app/modules/page-layouts/page-layouts.module";
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
            provide: APP_INITIALIZER,
            useFactory: (service: InitialConfigService) => () => service._initialConfigListener(),
            deps: [InitialConfigService],
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
