import { Component, ChangeDetectionStrategy, input, booleanAttribute } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-padded]': 'padded()',
    '[attr.data-interactive]': 'interactive()',
  },
  styleUrl: './card.component.scss',
  template: `
    <ng-content select="[slot=header]" />
    <div class="body"><ng-content /></div>
    <ng-content select="[slot=footer]" />
  `,
})
export class CardComponent {
  padded      = input(true,  { transform: booleanAttribute });
  interactive = input(false, { transform: booleanAttribute });
}
