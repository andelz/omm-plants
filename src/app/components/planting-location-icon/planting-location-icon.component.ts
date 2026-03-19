import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-planting-location-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.aria-hidden]': '"true"' },
  template: `
    @switch (location()) {
      @case ('sun') {
        <svg xmlns="http://www.w3.org/2000/svg" [attr.width]="size()" [attr.height]="size()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      }
      @case ('partial-sun') {
        <svg xmlns="http://www.w3.org/2000/svg" [attr.width]="size()" [attr.height]="size()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3V1m0 22v-2m9-9h2M1 12h2m15.07-6.07 1.42-1.42M4.22 19.78l1.42-1.42M18.36 18.36l1.42 1.42M4.22 4.22l1.42 1.42"/><circle cx="12" cy="12" r="5"/><path d="M12 7a5 5 0 0 0 0 10" fill="currentColor" opacity="0.3"/>
        </svg>
      }
      @case ('shade') {
        <svg xmlns="http://www.w3.org/2000/svg" [attr.width]="size()" [attr.height]="size()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      }
    }
  `,
  styles: `:host { display: inline-flex; align-items: center; line-height: 0; }`,
})
export class PlantingLocationIconComponent {
  location = input.required<'sun' | 'partial-sun' | 'shade'>();
  size = input<number>(14);
}
