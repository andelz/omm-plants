import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  booleanAttribute,
  forwardRef,
  Injectable,
  inject,
  effect,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// ── Scoped service for RadioGroup → Radio communication ──────────────────────

@Injectable()
export class RadioGroupService {
  readonly value    = signal<string>('');
  readonly name     = signal<string>('');
  readonly disabled = signal(false);
  private onChange: (v: string) => void = () => {};

  setOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  select(value: string): void {
    this.value.set(value);
    this.onChange(value);
  }
}

// ── RadioComponent ────────────────────────────────────────────────────────────

let nextId = 0;

@Component({
  selector: 'app-radio',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './radio-group.component.scss',
  template: `
    <label [attr.for]="inputId">
      <input
        type="radio"
        [id]="inputId"
        [name]="group.name()"
        [value]="value()"
        [checked]="group.value() === value()"
        [disabled]="disabled() || group.disabled()"
        (change)="onSelect()"
        (blur)="onTouched()"
      />
      <span class="radio-dot" aria-hidden="true"></span>
      <ng-content />
    </label>
  `,
})
export class RadioComponent {
  value    = input.required<string>();
  disabled = input(false, { transform: booleanAttribute });

  readonly inputId = `app-radio-${++nextId}`;
  readonly group = inject(RadioGroupService);
  onTouched: () => void = () => {};

  onSelect(): void {
    this.group.select(this.value());
  }
}

// ── RadioGroupComponent ───────────────────────────────────────────────────────

@Component({
  selector: 'app-radio-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    RadioGroupService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true,
    },
  ],
  host: {
    'role': 'radiogroup',
    '[attr.data-disabled]': 'disabled()',
    '[attr.aria-disabled]': 'disabled()',
  },
  styleUrl: './radio-group.component.scss',
  template: `<ng-content />`,
})
export class RadioGroupComponent implements ControlValueAccessor {
  name     = input<string>(`rg-${Math.random().toString(36).slice(2, 6)}`);
  disabled = input(false, { transform: booleanAttribute });

  private readonly groupService = inject(RadioGroupService);

  constructor() {
    effect(() => this.groupService.name.set(this.name()));
    effect(() => this.groupService.disabled.set(this.disabled()));
  }

  writeValue(value: string): void {
    this.groupService.value.set(value ?? '');
  }

  registerOnChange(fn: (v: string) => void): void {
    this.groupService.setOnChange(fn);
  }

  registerOnTouched(): void {}
  setDisabledState(): void {}
}
