import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {HeaderComponent} from "./components/header/header.component";
import {NgxsModule} from "@ngxs/store";
import {AppState} from "./store/app.state";
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ProfileState} from "./modules/profile/store/profile.state";
import {NgxsStoragePluginModule} from "@ngxs/storage-plugin";


@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        NgxsModule.forRoot([
            AppState,
            ProfileState
        ]),
        NgxsStoragePluginModule.forRoot({
            key: ProfileState
        }),
        BrowserAnimationsModule,
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production})
    ],
    providers: [
        //{provide: CONTENT_SERVICE, useClass: CachedWPContentServiceService}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
