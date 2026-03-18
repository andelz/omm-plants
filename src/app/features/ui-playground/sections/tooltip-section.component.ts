import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TooltipComponent } from '../../../ui/tooltip/tooltip.component';
import { ButtonComponent } from '../../../ui/button/button.component';

@Component({
  selector: 'app-tooltip-section',
  standalone: true,
  imports: [TooltipComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="tooltip" class="pg-section">
      <h2 class="pg-section-title">Tooltip</h2>

      <div class="pg-block">
        <h3 class="pg-block-title">Positions</h3>
        <div class="pg-row" style="padding:2rem 0">
          <app-tooltip text="Tooltip on top" position="top">
            <app-button variant="outline">Top</app-button>
          </app-tooltip>
          <app-tooltip text="Tooltip on bottom" position="bottom">
            <app-button variant="outline">Bottom</app-button>
          </app-tooltip>
          <app-tooltip text="Tooltip on left" position="left">
            <app-button variant="outline">Left</app-button>
          </app-tooltip>
          <app-tooltip text="Tooltip on right" position="right">
            <app-button variant="outline">Right</app-button>
          </app-tooltip>
        </div>
      </div>

      <details class="pg-code">
        <summary>Show code</summary>
        <pre><code>&lt;app-tooltip text="Helpful hint" position="top"&gt;
  &lt;app-button&gt;Hover me&lt;/app-button&gt;
&lt;/app-tooltip&gt;</code></pre>
      </details>
    </section>
  `,
})
export class TooltipSectionComponent {}
