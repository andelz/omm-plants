import { bootstrapApplication } from '@angular/platform-browser';
import { PlaygroundApp } from './app/playground-app.component';
import { playgroundConfig } from './app/playground.config';

bootstrapApplication(PlaygroundApp, playgroundConfig)
  .catch((err) => console.error(err));
