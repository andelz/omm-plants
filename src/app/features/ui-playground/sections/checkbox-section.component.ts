import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxComponent } from '../../../ui/checkbox/checkbox.component';

@Component({
  selector: 'app-checkbox-section',
  standalone: true,
  imports: [CheckboxComponent, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="checkbox" class="pg-section">
      <h2 class="pg-section-title">Checkbox</h2>

      <div class="pg-block">
        <h3 class="pg-block-title">States</h3>
        <div class="pg-col">
          <app-checkbox label="Unchecked" />
          <app-checkbox label="Checked" [ngModel]="true" />
          <app-checkbox label="Disabled unchecked" disabled />
          <app-checkbox label="Disabled checked" [ngModel]="true" disabled />
        </div>
      </div>

      <div class="pg-block">
        <h3 class="pg-block-title">Interactive</h3>
        <div class="pg-col">
          <app-checkbox
            label="I agree to the terms"
            [(ngModel)]="agreed"
          />
          <p style="font-size:var(--text-sm);color:var(--muted)">
            Agreed: {{ agreed() }}
          </p>
        </div>
      </div>

      <details class="pg-code">
        <summary>Show code</summary>
        <pre><code>&lt;app-checkbox label="Accept terms" [(ngModel)]="agreed" /&gt;
&lt;app-checkbox label="Disabled" disabled /&gt;</code></pre>
      </details>
    </section>
  `,
})
export class CheckboxSectionComponent {
  agreed = signal(false);
}
