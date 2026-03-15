import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { marker } from 'ngx-translate-extract-marker';
import { ThemeService } from '../../services/theme.service';

// Marker-only block for keys used in ternary template expressions
marker('NAV.PLANTS'); marker('NAV.SETTINGS');
marker('THEME.SWITCH_TO_LIGHT'); marker('THEME.SWITCH_TO_DARK'); marker('THEME.TOGGLE_LABEL');

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  theme = inject(ThemeService);
}
