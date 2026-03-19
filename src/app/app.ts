import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from './services/theme.service';
import { ShareIntentService } from './services/share-intent.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App implements OnInit {
  private theme = inject(ThemeService);
  private translate = inject(TranslateService);
  private router = inject(Router);
  private shareIntent = inject(ShareIntentService);

  ngOnInit() {
    this.theme.init();
    this.translate.use(localStorage.getItem('app-lang') ?? 'en');

    // Intercept Web Share Target navigation (real path, not hash-based)
    if (window.location.pathname === '/share') {
      const params = new URLSearchParams(window.location.search);
      this.shareIntent.setPending({
        url: params.get('url') ?? '',
        title: params.get('title') ?? '',
        text: params.get('text') ?? '',
      });
      window.history.replaceState(null, '', '/');
      this.router.navigate(['/share']);
    }
  }
}
