import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'plants', pathMatch: 'full' },
      {
        path: 'plants',
        loadComponent: () =>
          import('./features/plant-list/plant-list.component').then(m => m.PlantListComponent),
      },
      {
        path: 'plants/new',
        loadComponent: () =>
          import('./features/plant-form/plant-form.component').then(m => m.PlantFormComponent),
      },
      {
        path: 'plants/:id/edit',
        loadComponent: () =>
          import('./features/plant-form/plant-form.component').then(m => m.PlantFormComponent),
      },
      {
        path: 'plants/:id',
        loadComponent: () =>
          import('./features/plant-detail/plant-detail.component').then(m => m.PlantDetailComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then(m => m.SettingsComponent),
      },
    ],
  },
];
