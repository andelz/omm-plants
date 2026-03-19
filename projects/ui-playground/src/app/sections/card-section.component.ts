import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CardComponent, ButtonComponent, BadgeComponent } from '@ui';

@Component({
  selector: 'app-card-section',
  standalone: true,
  imports: [CardComponent, ButtonComponent, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="card" class="pg-section">
      <h2 class="pg-section-title">Card</h2>

      <div class="pg-block">
        <h3 class="pg-block-title">Variants</h3>
        <div class="pg-row pg-row--wrap">
          <app-card style="width:240px">
            <p>Simple card with body content projection.</p>
          </app-card>

          <app-card style="width:240px">
            <div slot="header">Card Title</div>
            <p>Card with header slot.</p>
          </app-card>

          <app-card style="width:240px">
            <div slot="header" style="display:flex;align-items:center;justify-content:space-between">
              With Footer
              <app-badge variant="success">New</app-badge>
            </div>
            <p>Card with header and footer.</p>
            <div slot="footer" style="display:flex;gap:var(--space-2);justify-content:flex-end">
              <app-button size="sm" variant="outline">Cancel</app-button>
              <app-button size="sm">Save</app-button>
            </div>
          </app-card>

          <app-card style="width:200px" interactive>
            <p>Interactive card — hover me!</p>
          </app-card>
        </div>
      </div>

      <details class="pg-code">
        <summary>Show code</summary>
        <pre><code>&lt;app-card&gt;Body content&lt;/app-card&gt;

&lt;app-card&gt;
  &lt;div slot="header"&gt;Title&lt;/div&gt;
  Body content
  &lt;div slot="footer"&gt;
    &lt;app-button size="sm"&gt;Save&lt;/app-button&gt;
  &lt;/div&gt;
&lt;/app-card&gt;

&lt;app-card interactive&gt;Clickable card&lt;/app-card&gt;</code></pre>
      </details>
    </section>
  `,
  styles: `
    .pg-row {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }`,
})
export class CardSectionComponent {}
