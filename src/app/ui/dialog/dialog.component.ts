import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  viewChild,
  ElementRef,
  signal,
  NgZone,
  inject,
  booleanAttribute,
} from '@angular/core';

@Component({
  selector: 'app-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './dialog.component.scss',
  template: `
    <dialog
      #dialogEl
      [attr.aria-labelledby]="titleId"
      (cancel)="onCancel($event)"
      (click)="onBackdropClick($event)"
    >
      <div class="dialog-surface" (click)="$event.stopPropagation()">
        @if (title()) {
          <div class="dialog-header">
            <h2 class="dialog-title" [id]="titleId">{{ title() }}</h2>
            @if (!hideClose()) {
              <button
                type="button"
                class="close-btn"
                aria-label="Close dialog"
                (click)="close()"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>
            }
          </div>
        }
        <div class="dialog-body">
          <ng-content />
        </div>
        <ng-content select="[slot=footer]" />
      </div>
    </dialog>
  `,
})
export class DialogComponent {
  title     = input('');
  hideClose = input(false, { transform: booleanAttribute });

  readonly closed = output<void>();

  readonly titleId = `app-dialog-title-${Math.random().toString(36).slice(2, 8)}`;
  readonly isOpen = signal(false);

  private readonly zone = inject(NgZone);
  private readonly dialogEl = viewChild.required<ElementRef<HTMLDialogElement>>('dialogEl');

  open(): void {
    this.zone.run(() => {
      this.isOpen.set(true);
      this.dialogEl().nativeElement.showModal();
    });
  }

  close(): void {
    this.zone.run(() => {
      this.dialogEl().nativeElement.close();
      this.isOpen.set(false);
      this.closed.emit();
    });
  }

  onCancel(event: Event): void {
    event.preventDefault(); // we handle closing ourselves
    this.close();
  }

  onBackdropClick(event: MouseEvent): void {
    // The <dialog> element is the backdrop; clicking outside the surface closes it
    const target = event.target as HTMLElement;
    if (target.tagName === 'DIALOG') {
      this.close();
    }
  }
}
