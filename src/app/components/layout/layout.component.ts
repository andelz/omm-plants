import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  theme = inject(ThemeService);
}
