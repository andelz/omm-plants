import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'size()',
    'role': 'status',
    '[attr.aria-label]': 'label()',
  },
  styleUrl: './spinner.component.scss',
  template: `<span class="track"><span class="arc"></span></span>`,
})
export class SpinnerComponent {
  size  = input<'sm' | 'md' | 'lg'>('md');
  label = input('Loading…');
}
