import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  booleanAttribute,
  forwardRef,
  contentChildren,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  host: {
    '[attr.data-disabled]': 'disabled()',
    '[attr.data-invalid]': 'invalid()',
  },
  styleUrl: './select.component.scss',
  template: `
    <div class="wrapper">
      <select
        [disabled]="disabled()"
        [attr.aria-invalid]="invalid() || null"
        [attr.aria-describedby]="errorMessage() ? errorId : null"
        (change)="onSelectChange($event)"
        (blur)="onTouched()"
      >
        <ng-content />
      </select>
      <span class="arrow" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </div>
    @if (errorMessage()) {
      <span class="error-msg" role="alert" [id]="errorId">{{ errorMessage() }}</span>
    }
  `,
})
export class SelectComponent implements ControlValueAccessor {
  disabled     = input(false, { transform: booleanAttribute });
  invalid      = input(false, { transform: booleanAttribute });
  errorMessage = input<string>('');

  readonly errorId = `app-select-err-${Math.random().toString(36).slice(2, 8)}`;
  readonly _value = signal<string>('');

  private onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this._value.set(value ?? '');
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(): void {}

  onSelectChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this._value.set(value);
    this.onChange(value);
  }
}
