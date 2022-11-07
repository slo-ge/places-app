import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from '@app/app.module';
import { environment } from '@environment/environment';
import * as Sentry from "@sentry/angular";
import { BrowserTracing } from "@sentry/tracing";

if (environment.production) {
  enableProdMode();
  Sentry.init({
    dsn: environment.sentry.dsn,
    integrations: [
      new BrowserTracing({
        tracingOrigins: ["localhost", "https://meta-mapper.com"],
        routingInstrumentation: Sentry.routingInstrumentation,
      }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.8,
  });
}



platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
