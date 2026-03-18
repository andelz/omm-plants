import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../ui/input/input.component';

@Component({
  selector: 'app-input-section',
  standalone: true,
  imports: [InputComponent, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="input" class="pg-section">
      <h2 class="pg-section-title">Input</h2>

      <div class="pg-block">
        <h3 class="pg-block-title">Types</h3>
        <div class="pg-col">
          <app-input placeholder="Text input" />
          <app-input type="email" placeholder="Email address" />
          <app-input type="password" placeholder="Password" />
          <app-input type="search" placeholder="Search…" clearable />
          <app-input type="number" placeholder="Number" />
        </div>
      </div>

      <div class="pg-block">
        <h3 class="pg-block-title">With prefix / suffix</h3>
        <div class="pg-col">
          <app-input placeholder="Search plants…" clearable>
            <svg slot="prefix" width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
              <path d="M11 11l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </app-input>
          <app-input placeholder="0.00">
            <span slot="prefix" style="font-size:0.8rem;color:var(--muted)">€</span>
          </app-input>
        </div>
      </div>

      <div class="pg-block">
        <h3 class="pg-block-title">States</h3>
        <div class="pg-col">
          <app-input placeholder="Disabled" disabled />
          <app-input
            placeholder="Invalid value"
            invalid
            errorMessage="This field is required"
          />
        </div>
      </div>

      <details class="pg-code">
        <summary>Show code</summary>
        <pre><code>&lt;app-input placeholder="Text" /&gt;
&lt;app-input type="search" placeholder="Search…" clearable /&gt;
&lt;app-input invalid errorMessage="This field is required" /&gt;

&lt;!-- With ngModel --&gt;
&lt;app-input [(ngModel)]="value" placeholder="Type here" /&gt;

&lt;!-- With prefix slot --&gt;
&lt;app-input placeholder="Search"&gt;
  &lt;svg slot="prefix" ...&gt;...&lt;/svg&gt;
&lt;/app-input&gt;</code></pre>
      </details>
    </section>
  `,
})
export class InputSectionComponent {}
