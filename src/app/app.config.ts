import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation, withViewTransitions } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withHashLocation(), withViewTransitions({
      onViewTransitionCreated({ transition, from, to }) {
        const doc = document.documentElement;
        const fromUrl = from.url.toString();
        const toUrl = to.url.toString();

        // Determine navigation direction for CSS-driven slide animations
        const isForward =
          (fromUrl.startsWith('plants') && toUrl.match(/^plants\/[^/]+$/)) ||
          (fromUrl.startsWith('plants') && toUrl === 'plants/new') ||
          (toUrl.match(/^plants\/[^/]+\/edit$/));
        doc.classList.add(isForward ? 'nav-forward' : 'nav-back');
        transition.finished.then(() => {
          doc.classList.remove('nav-forward', 'nav-back');
        });
      },
    })),
    provideHttpClient(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideTranslateService({
      lang: 'en',
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json',
      }),
    }),
  ],
};
