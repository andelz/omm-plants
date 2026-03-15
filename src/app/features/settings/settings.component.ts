import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../services/theme.service';
import { DbService } from '../../services/db.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  theme = inject(ThemeService);
  private db = inject(DbService);
  private translate = inject(TranslateService);

  async clearAllData() {
    const msg = this.translate.instant('SETTINGS.CLEAR_DATA_CONFIRM');
    if (!window.confirm(msg)) return;
    await this.db.clearAll();
    alert(this.translate.instant('SETTINGS.CLEAR_DATA_SUCCESS'));
  }
}
