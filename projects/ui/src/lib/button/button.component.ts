import {
  Component,
  ChangeDetectionStrategy,
  input,
  booleanAttribute,
} from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
  },
  styleUrl: './button.component.scss',
  template: `
    <button
      [type]="type()"
      [disabled]="disabled() || loading()"
      [attr.aria-disabled]="disabled() || loading() || null"
      [attr.aria-busy]="loading() || null"
    >
      @if (loading()) {
        <app-spinner size="sm" aria-hidden="true" />
      }
      <ng-content />
    </button>
  `,
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  size    = input<ButtonSize>('md');
  type    = input<'button' | 'submit' | 'reset'>('button');
  disabled = input(false, { transform: booleanAttribute });
  loading  = input(false, { transform: booleanAttribute });
}
