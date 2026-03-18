import { Component, inject, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../services/theme.service';
import { DbService } from '../../services/db.service';
import { PremiumService } from '../../services/premium.service';

const LANG_KEY = 'app-lang';

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
] as const;

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  theme = inject(ThemeService);
  premium = inject(PremiumService);
  private db = inject(DbService);
  private translate = inject(TranslateService);

  readonly languages = LANGUAGES;
  currentLang = signal(localStorage.getItem(LANG_KEY) ?? 'en');

  setLanguage(code: string) {
    this.translate.use(code);
    this.currentLang.set(code);
    localStorage.setItem(LANG_KEY, code);
  }

  async clearAllData() {
    const msg = this.translate.instant('settings.clear_data_confirm');
    if (!window.confirm(msg)) return;
    await this.db.clearAll();
    alert(this.translate.instant('settings.clear_data_success'));
  }
}
