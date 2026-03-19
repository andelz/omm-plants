import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  booleanAttribute,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputType = 'text' | 'email' | 'number' | 'search' | 'password' | 'tel' | 'url';

let nextId = 0;

@Component({
  selector: 'app-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  host: {
    '[attr.data-disabled]': 'disabled()',
    '[attr.data-invalid]': 'invalid()',
    '[attr.data-has-prefix]': '_hasPrefix',
    '[attr.data-has-suffix]': '_hasSuffix',
  },
  styleUrl: './input.component.scss',
  template: `
    <div class="wrapper">
      <span class="prefix" #prefixSlot><ng-content select="[slot=prefix]" /></span>
      <input
        [type]="type()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [attr.autocomplete]="autocomplete() || null"
        [attr.aria-invalid]="invalid() || null"
        [attr.aria-describedby]="errorMessage() ? errorId : null"
        [value]="_value()"
        (input)="onNativeInput($event)"
        (blur)="onTouched()"
      />
      <span class="suffix">
        @if (clearable() && _value()) {
          <button
            type="button"
            class="clear-btn"
            aria-label="Clear"
            tabindex="-1"
            (click)="clear()"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        }
        <ng-content select="[slot=suffix]" />
      </span>
    </div>
    @if (errorMessage()) {
      <span class="error-msg" role="alert" [id]="errorId">{{ errorMessage() }}</span>
    }
  `,
})
export class InputComponent implements ControlValueAccessor {
  type         = input<InputType>('text');
  placeholder  = input('');
  disabled     = input(false, { transform: booleanAttribute });
  invalid      = input(false, { transform: booleanAttribute });
  clearable    = input(false, { transform: booleanAttribute });
  autocomplete = input<string>('');
  errorMessage = input<string>('');

  // These would be set dynamically if needed; static false is fine for most uses
  readonly _hasPrefix = false;
  readonly _hasSuffix = false;

  readonly errorId = `app-input-err-${++nextId}`;
  readonly _value = signal('');

  private onChange: (v: string | number) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string | number): void {
    this._value.set(value != null ? String(value) : '');
  }

  registerOnChange(fn: (v: string | number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(): void {}

  onNativeInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this._value.set(value);
    this.onChange(this.type() === 'number' ? Number(value) : value);
  }

  clear(): void {
    this._value.set('');
    this.onChange('');
    this.onTouched();
  }
}
