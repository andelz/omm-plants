import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

const SECTIONS = [
  { path: 'button',   label: 'Button' },
  { path: 'badge',    label: 'Badge' },
  { path: 'spinner',  label: 'Spinner' },
  { path: 'input',    label: 'Input' },
  { path: 'textarea', label: 'Textarea' },
  { path: 'select',   label: 'Select' },
  { path: 'checkbox', label: 'Checkbox' },
  { path: 'toggle',   label: 'Toggle' },
  { path: 'radio',    label: 'Radio Group' },
  { path: 'card',     label: 'Card' },
  { path: 'dialog',   label: 'Dialog' },
  { path: 'tooltip',  label: 'Tooltip' },
] as const;

@Component({
  selector: 'app-ui-playground',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  styleUrl: './ui-playground.component.scss',
  templateUrl: './ui-playground.component.html',
})
export class UiPlaygroundComponent {
  readonly sections = SECTIONS;
}
