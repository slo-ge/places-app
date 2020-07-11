import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HeaderComponent} from "./components/header/header.component";
import {NgxsModule} from "@ngxs/store";
import {AppState} from "./store/app.state";
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ProfileState} from "./modules/profile/store/profile.state";
import {NgxsStoragePluginModule} from "@ngxs/storage-plugin";
import {LoadingInterceptor} from "./core/interceptors/loading.interceptor";
import {TransferHttpCacheModule} from '@nguniversal/common';


@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        TransferHttpCacheModule,
        AppRoutingModule,
        HttpClientModule,
        NgxsModule.forRoot([
            AppState,
            ProfileState
        ], {developmentMode: !environment.production}),
        NgxsStoragePluginModule.forRoot({
            key: ProfileState
        }),
        BrowserAnimationsModule,
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    ],
    providers: [
        //{provide: CONTENT_SERVICE, useClass: CachedWPContentServiceService}
        {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
