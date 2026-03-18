import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  booleanAttribute,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextId = 0;

@Component({
  selector: 'app-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleComponent),
      multi: true,
    },
  ],
  host: {
    '[attr.data-checked]': '_checked()',
    '[attr.data-disabled]': 'disabled()',
  },
  styleUrl: './toggle.component.scss',
  template: `
    <label [attr.for]="inputId">
      <input
        type="checkbox"
        role="switch"
        [id]="inputId"
        [checked]="_checked()"
        [disabled]="disabled()"
        [attr.aria-checked]="_checked()"
        (change)="onInputChange($event)"
        (blur)="onTouched()"
      />
      <span class="track" aria-hidden="true">
        <span class="thumb"></span>
      </span>
      @if (label()) {
        <span class="label-text">{{ label() }}</span>
      }
      <ng-content />
    </label>
  `,
})
export class ToggleComponent implements ControlValueAccessor {
  label    = input<string>('');
  disabled = input(false, { transform: booleanAttribute });

  readonly inputId = `app-toggle-${++nextId}`;
  readonly _checked = signal(false);

  private onChange: (v: boolean) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: boolean): void {
    this._checked.set(!!value);
  }

  registerOnChange(fn: (v: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(): void {}

  onInputChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this._checked.set(checked);
    this.onChange(checked);
  }
}
