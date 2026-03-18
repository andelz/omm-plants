import { Routes } from '@angular/router';
import { UiPlaygroundComponent } from './ui-playground.component';

export const playgroundRoutes: Routes = [
  {
    path: '',
    component: UiPlaygroundComponent,
    children: [
      { path: '', redirectTo: 'button', pathMatch: 'full' },
      {
        path: 'button',
        loadComponent: () =>
          import('./sections/button-section.component').then(m => m.ButtonSectionComponent),
      },
      {
        path: 'badge',
        loadComponent: () =>
          import('./sections/badge-section.component').then(m => m.BadgeSectionComponent),
      },
      {
        path: 'spinner',
        loadComponent: () =>
          import('./sections/spinner-section.component').then(m => m.SpinnerSectionComponent),
      },
      {
        path: 'input',
        loadComponent: () =>
          import('./sections/input-section.component').then(m => m.InputSectionComponent),
      },
      {
        path: 'textarea',
        loadComponent: () =>
          import('./sections/textarea-section.component').then(m => m.TextareaSectionComponent),
      },
      {
        path: 'select',
        loadComponent: () =>
          import('./sections/select-section.component').then(m => m.SelectSectionComponent),
      },
      {
        path: 'checkbox',
        loadComponent: () =>
          import('./sections/checkbox-section.component').then(m => m.CheckboxSectionComponent),
      },
      {
        path: 'toggle',
        loadComponent: () =>
          import('./sections/toggle-section.component').then(m => m.ToggleSectionComponent),
      },
      {
        path: 'radio',
        loadComponent: () =>
          import('./sections/radio-section.component').then(m => m.RadioSectionComponent),
      },
      {
        path: 'card',
        loadComponent: () =>
          import('./sections/card-section.component').then(m => m.CardSectionComponent),
      },
      {
        path: 'dialog',
        loadComponent: () =>
          import('./sections/dialog-section.component').then(m => m.DialogSectionComponent),
      },
      {
        path: 'tooltip',
        loadComponent: () =>
          import('./sections/tooltip-section.component').then(m => m.TooltipSectionComponent),
      },
    ],
  },
];
