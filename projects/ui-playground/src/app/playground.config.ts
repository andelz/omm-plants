import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { playgroundRoutes } from '../../../../src/app/features/ui-playground/playground.routes';

export const playgroundConfig: ApplicationConfig = {
  providers: [
    provideRouter(playgroundRoutes),
  ],
};
