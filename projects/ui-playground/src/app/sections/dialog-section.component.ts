import { Component, ChangeDetectionStrategy, viewChild } from '@angular/core';
import { DialogComponent, ButtonComponent } from '@ui';

@Component({
  selector: 'app-dialog-section',
  standalone: true,
  imports: [DialogComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .pg-row {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }`,
  template: `
    <section id="dialog" class="pg-section">
      <h2 class="pg-section-title">Dialog</h2>

      <div class="pg-block">
        <h3 class="pg-block-title">Modal</h3>
        <div class="pg-row">
          <app-button (click)="openBasic()">Open dialog</app-button>
          <app-button variant="destructive" (click)="openDanger()">
            Destructive dialog
          </app-button>
        </div>
      </div>

      <app-dialog #basicDialogRef title="Confirm action">
        <p>Are you sure you want to continue? This action cannot be undone.</p>
        <div slot="footer">
          <app-button variant="outline" (click)="closeBasic()">Cancel</app-button>
          <app-button (click)="closeBasic()">Confirm</app-button>
        </div>
      </app-dialog>

      <app-dialog #dangerDialogRef title="Delete plant">
        <p>This will permanently delete the plant and all its care history.</p>
        <div slot="footer">
          <app-button variant="outline" (click)="closeDanger()">Cancel</app-button>
          <app-button variant="destructive" (click)="closeDanger()">Delete</app-button>
        </div>
      </app-dialog>

      <details class="pg-code">
        <summary>Show code</summary>
        <pre><code>&lt;app-button (click)="openDialog()"&gt;Open&lt;/app-button&gt;

&lt;app-dialog #dialogRef title="Confirm"&gt;
  &lt;p&gt;Dialog body content.&lt;/p&gt;
  &lt;div slot="footer"&gt;
    &lt;app-button variant="outline" (click)="closeDialog()"&gt;Cancel&lt;/app-button&gt;
    &lt;app-button (click)="closeDialog()"&gt;Confirm&lt;/app-button&gt;
  &lt;/div&gt;
&lt;/app-dialog&gt;

// In component class:
readonly dialogRef = viewChild.required&lt;DialogComponent&gt;('dialogRef');
openDialog()  &#123; this.dialogRef().open(); &#125;
closeDialog() &#123; this.dialogRef().close(); &#125;</code></pre>
      </details>
    </section>
  `,
})
export class DialogSectionComponent {
  readonly basicDialogRef  = viewChild.required<DialogComponent>('basicDialogRef');
  readonly dangerDialogRef = viewChild.required<DialogComponent>('dangerDialogRef');

  openBasic():   void { this.basicDialogRef().open(); }
  closeBasic():  void { this.basicDialogRef().close(); }
  openDanger():  void { this.dangerDialogRef().open(); }
  closeDanger(): void { this.dangerDialogRef().close(); }
}
