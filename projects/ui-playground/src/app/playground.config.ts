import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { playgroundRoutes } from './playground.routes';

export const playgroundConfig: ApplicationConfig = {
  providers: [
    provideRouter(playgroundRoutes),
  ],
};
