import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { DbService } from '../../services/db.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  theme = inject(ThemeService);
  private db = inject(DbService);

  async clearAllData() {
    if (!window.confirm('Delete all plant data? This cannot be undone.')) return;
    await this.db.clearAll();
    alert('All data cleared.');
  }
}
