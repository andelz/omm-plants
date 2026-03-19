import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  booleanAttribute,
  forwardRef,
  ElementRef,
  viewChild,
  effect,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
  host: {
    '[attr.data-disabled]': 'disabled()',
    '[attr.data-invalid]': 'invalid()',
  },
  styleUrl: './textarea.component.scss',
  template: `
    <textarea
      #textareaEl
      [placeholder]="placeholder()"
      [rows]="rows()"
      [disabled]="disabled()"
      [attr.aria-invalid]="invalid() || null"
      [attr.aria-describedby]="errorMessage() ? errorId : null"
      (input)="onTextInput($event)"
      (blur)="onTouched()"
    >{{ _value() }}</textarea>
    @if (errorMessage()) {
      <span class="error-msg" role="alert" [id]="errorId">{{ errorMessage() }}</span>
    }
  `,
})
export class TextareaComponent implements ControlValueAccessor {
  placeholder  = input('');
  rows         = input(4);
  disabled     = input(false, { transform: booleanAttribute });
  invalid      = input(false, { transform: booleanAttribute });
  autoResize   = input(false, { transform: booleanAttribute });
  errorMessage = input<string>('');

  readonly errorId = `app-textarea-err-${Math.random().toString(36).slice(2, 8)}`;
  readonly _value = signal('');

  private readonly textareaEl = viewChild<ElementRef<HTMLTextAreaElement>>('textareaEl');

  private onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      if (this.autoResize()) {
        const el = this.textareaEl()?.nativeElement;
        if (el) {
          el.style.height = 'auto';
          el.style.height = `${el.scrollHeight}px`;
        }
      }
    });
  }

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

  onTextInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this._value.set(value);
    this.onChange(value);

    if (this.autoResize()) {
      const el = event.target as HTMLTextAreaElement;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }
}
