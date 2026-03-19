import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ButtonComponent } from '@ui';

@Component({
  selector: 'app-button-section',
  standalone: true,
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .pg-row {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }`,
  template: `
    <section id="button" class="pg-section">
      <h2 class="pg-section-title">Button</h2>

      <div class="pg-block">
        <h3 class="pg-block-title">Variants</h3>
        <div class="pg-row">
          <app-button variant="primary">Primary</app-button>
          <app-button variant="secondary">Secondary</app-button>
          <app-button variant="outline">Outline</app-button>
          <app-button variant="ghost">Ghost</app-button>
          <app-button variant="destructive">Destructive</app-button>
        </div>
      </div>

      <div class="pg-block">
        <h3 class="pg-block-title">Sizes</h3>
        <div class="pg-row pg-row--align-center">
          <app-button size="sm">Small</app-button>
          <app-button size="md">Medium</app-button>
          <app-button size="lg">Large</app-button>
        </div>
      </div>

      <div class="pg-block">
        <h3 class="pg-block-title">States</h3>
        <div class="pg-row">
          <app-button [loading]="isLoading()">
            {{ isLoading() ? 'Saving…' : 'Save' }}
          </app-button>
          <app-button (click)="toggleLoading()">Toggle loading</app-button>
          <app-button disabled>Disabled</app-button>
          <app-button variant="outline" disabled>Disabled outline</app-button>
        </div>
      </div>

      <details class="pg-code">
        <summary>Show code</summary>
        <pre><code>&lt;app-button variant="primary"&gt;Primary&lt;/app-button&gt;
&lt;app-button variant="outline" size="sm"&gt;Small outline&lt;/app-button&gt;
&lt;app-button [loading]="saving()" type="submit"&gt;Save&lt;/app-button&gt;
&lt;app-button disabled&gt;Disabled&lt;/app-button&gt;</code></pre>
      </details>
    </section>
  `,
})
export class ButtonSectionComponent {
  isLoading = signal(false);

  toggleLoading(): void {
    this.isLoading.set(true);
    setTimeout(() => this.isLoading.set(false), 2000);
  }
}
