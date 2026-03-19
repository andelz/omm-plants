import { Component, ChangeDetectionStrategy, input } from '@angular/core';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';

@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-variant]': 'variant()' },
  styleUrl: './badge.component.scss',
  template: `<ng-content />`,
})
export class BadgeComponent {
  variant = input<BadgeVariant>('default');
}
