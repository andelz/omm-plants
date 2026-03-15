import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { marker } from 'ngx-translate-extract-marker';
import { ThemeService } from '../../services/theme.service';

// Marker-only block for keys used in ternary template expressions
marker('nav.plants'); marker('nav.settings');
marker('theme.switch_to_light'); marker('theme.switch_to_dark'); marker('theme.toggle_label');

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  theme = inject(ThemeService);
  updateAvailable = signal(false);

  constructor() {
    const swUpdate = inject(SwUpdate, { optional: true });
    if (swUpdate?.isEnabled) {
      swUpdate.versionUpdates.subscribe((event) => {
        if (event.type === 'VERSION_READY') {
          this.updateAvailable.set(true);
        }
      });
    }
  }

  reload() {
    window.location.reload();
  }
}
