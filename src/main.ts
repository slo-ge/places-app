import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as Sentry from "@sentry/angular";
import { BrowserTracing } from "@sentry/tracing";

if (environment.production) {
  enableProdMode();
}

Sentry.init({
  dsn: "https://1eeebf86458547fa801a5ff636e666d6@o1429201.ingest.sentry.io/4503887086354432",
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

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
