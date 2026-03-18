import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-position]': 'position()' },
  styleUrl: './tooltip.component.scss',
  template: `
    <ng-content />
    <span class="tip" role="tooltip">{{ text() }}</span>
  `,
})
export class TooltipComponent {
  text     = input.required<string>();
  position = input<'top' | 'bottom' | 'left' | 'right'>('top');
}
