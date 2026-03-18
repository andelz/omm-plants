import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioGroupComponent, RadioComponent } from '../../../ui/radio-group/radio-group.component';

@Component({
  selector: 'app-radio-section',
  standalone: true,
  imports: [RadioGroupComponent, RadioComponent, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="radio" class="pg-section">
      <h2 class="pg-section-title">Radio Group</h2>

      <div class="pg-block">
        <h3 class="pg-block-title">Interactive</h3>
        <div class="pg-col">
          <app-radio-group [(ngModel)]="selected" name="light">
            <app-radio value="sun">Full Sun</app-radio>
            <app-radio value="partial">Partial Sun</app-radio>
            <app-radio value="shade">Shade</app-radio>
          </app-radio-group>
          <p style="font-size:var(--text-sm);color:var(--muted)">
            Selected: {{ selected() }}
          </p>
        </div>
      </div>

      <div class="pg-block">
        <h3 class="pg-block-title">Disabled</h3>
        <app-radio-group [ngModel]="'sun'" disabled name="disabled">
          <app-radio value="sun">Full Sun</app-radio>
          <app-radio value="partial">Partial Sun</app-radio>
        </app-radio-group>
      </div>

      <details class="pg-code">
        <summary>Show code</summary>
        <pre><code>&lt;app-radio-group [(ngModel)]="location" name="location"&gt;
  &lt;app-radio value="sun"&gt;Full Sun&lt;/app-radio&gt;
  &lt;app-radio value="partial"&gt;Partial Sun&lt;/app-radio&gt;
  &lt;app-radio value="shade"&gt;Shade&lt;/app-radio&gt;
&lt;/app-radio-group&gt;</code></pre>
      </details>
    </section>
  `,
})
export class RadioSectionComponent {
  selected = signal('partial');
}
