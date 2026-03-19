import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SelectComponent } from '@ui';

@Component({
  selector: 'app-select-section',
  standalone: true,
  imports: [SelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="select" class="pg-section">
      <h2 class="pg-section-title">Select</h2>

      <div class="pg-block">
        <h3 class="pg-block-title">Default</h3>
        <div class="pg-col">
          <app-select>
            <option value="">Pick an option…</option>
            <option value="sun">Full Sun</option>
            <option value="partial">Partial Sun</option>
            <option value="shade">Shade</option>
          </app-select>
          <app-select disabled>
            <option>Disabled</option>
          </app-select>
          <app-select invalid errorMessage="Please select a value">
            <option value="">Pick an option…</option>
            <option value="a">Option A</option>
          </app-select>
        </div>
      </div>

      <details class="pg-code">
        <summary>Show code</summary>
        <pre><code>&lt;app-select&gt;
  &lt;option value=""&gt;Pick…&lt;/option&gt;
  &lt;option value="sun"&gt;Full Sun&lt;/option&gt;
&lt;/app-select&gt;

&lt;!-- With reactive forms --&gt;
&lt;app-select formControlName="location"&gt;
  &lt;option value=""&gt;Pick…&lt;/option&gt;
&lt;/app-select&gt;</code></pre>
      </details>
    </section>
  `,
  styles: `
    .pg-col {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }`,
})
export class SelectSectionComponent {}
