import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TextareaComponent } from '@ui';

@Component({
  selector: 'app-textarea-section',
  standalone: true,
  imports: [TextareaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="textarea" class="pg-section">
      <h2 class="pg-section-title">Textarea</h2>

      <div class="pg-block">
        <h3 class="pg-block-title">Default</h3>
        <div class="pg-col">
          <app-textarea placeholder="Enter notes…" />
          <app-textarea placeholder="Auto-resize as you type…" autoResize />
          <app-textarea placeholder="Disabled" disabled />
          <app-textarea
            placeholder="Invalid"
            invalid
            errorMessage="Notes are required"
          />
        </div>
      </div>

      <details class="pg-code">
        <summary>Show code</summary>
        <pre><code>&lt;app-textarea placeholder="Enter notes…" /&gt;
&lt;app-textarea autoResize placeholder="Grows as you type" /&gt;
&lt;app-textarea invalid errorMessage="Required" /&gt;</code></pre>
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
export class TextareaSectionComponent {}
