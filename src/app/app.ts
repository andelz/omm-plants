import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App implements OnInit {
  private theme = inject(ThemeService);
  private translate = inject(TranslateService);

  ngOnInit() {
    this.theme.init();
    this.translate.use(localStorage.getItem('app-lang') ?? 'en');
  }
}
