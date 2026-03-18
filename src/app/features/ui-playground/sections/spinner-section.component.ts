import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SpinnerComponent } from '../../../ui/spinner/spinner.component';

@Component({
  selector: 'app-spinner-section',
  standalone: true,
  imports: [SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="spinner" class="pg-section">
      <h2 class="pg-section-title">Spinner</h2>

      <div class="pg-block">
        <h3 class="pg-block-title">Sizes</h3>
        <div class="pg-row pg-row--align-center">
          <app-spinner size="sm" />
          <app-spinner size="md" />
          <app-spinner size="lg" />
        </div>
      </div>

      <details class="pg-code">
        <summary>Show code</summary>
        <pre><code>&lt;app-spinner size="sm" /&gt;
&lt;app-spinner size="md" /&gt;
&lt;app-spinner size="lg" /&gt;</code></pre>
      </details>
    </section>
  `,
})
export class SpinnerSectionComponent {}
