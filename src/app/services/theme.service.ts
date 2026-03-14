import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal(false);

  init(): void {
    const stored = localStorage.getItem('theme');
    const dark = stored === 'dark';
    this.isDark.set(dark);
    this._apply(dark);
  }

  toggle(): void {
    const next = !this.isDark();
    this.isDark.set(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    this._apply(next);
  }

  private _apply(dark: boolean): void {
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }
}
