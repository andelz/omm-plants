import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleComponent } from '@ui';

@Component({
  selector: 'app-toggle-section',
  standalone: true,
  imports: [ToggleComponent, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="toggle" class="pg-section">
      <h2 class="pg-section-title">Toggle / Switch</h2>

      <div class="pg-block">
        <h3 class="pg-block-title">States</h3>
        <div class="pg-col">
          <app-toggle label="Off" />
          <app-toggle label="On" [ngModel]="true" />
          <app-toggle label="Disabled" disabled />
          <app-toggle label="Disabled on" [ngModel]="true" disabled />
        </div>
      </div>

      <div class="pg-block">
        <h3 class="pg-block-title">Interactive</h3>
        <div class="pg-col">
          <app-toggle label="Dark mode" [(ngModel)]="darkEnabled" />
          <p style="font-size:var(--text-sm);color:var(--muted)">
            Enabled: {{ darkEnabled() }}
          </p>
        </div>
      </div>

      <details class="pg-code">
        <summary>Show code</summary>
        <pre><code>&lt;app-toggle label="Dark mode" [(ngModel)]="isDark" /&gt;
&lt;app-toggle label="Disabled" disabled /&gt;</code></pre>
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
export class ToggleSectionComponent {
  darkEnabled = signal(false);
}
