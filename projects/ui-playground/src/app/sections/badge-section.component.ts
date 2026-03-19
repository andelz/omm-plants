import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BadgeComponent } from '@ui';

@Component({
  selector: 'app-badge-section',
  standalone: true,
  imports: [BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="badge" class="pg-section">
      <h2 class="pg-section-title">Badge</h2>

      <div class="pg-block">
        <h3 class="pg-block-title">Variants</h3>
        <div class="pg-row">
          <app-badge>Default</app-badge>
          <app-badge variant="success">Success</app-badge>
          <app-badge variant="warning">Warning</app-badge>
          <app-badge variant="error">Error</app-badge>
          <app-badge variant="info">Info</app-badge>
          <app-badge variant="outline">Outline</app-badge>
        </div>
      </div>

      <details class="pg-code">
        <summary>Show code</summary>
        <pre><code>&lt;app-badge&gt;Default&lt;/app-badge&gt;
&lt;app-badge variant="success"&gt;Success&lt;/app-badge&gt;
&lt;app-badge variant="error"&gt;Error&lt;/app-badge&gt;</code></pre>
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
export class BadgeSectionComponent {}
