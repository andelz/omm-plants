import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DbService } from '../../services/db.service';
import { Plant, worstStatus, DueStatus, daysUntilDue } from '../../models/plant.model';

@Component({
  selector: 'app-plant-list',
  standalone: true,
  imports: [RouterLink, FormsModule, TranslateModule],
  templateUrl: './plant-list.component.html',
  styleUrl: './plant-list.component.scss',
})
export class PlantListComponent implements OnInit {
  private db = inject(DbService);
  private translate = inject(TranslateService);

  plants = signal<Plant[]>([]);
  searchQuery = signal('');

  filteredPlants = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.plants();
    return this.plants().filter((p) => p.name.toLowerCase().includes(q));
  });

  async ngOnInit() {
    await this.loadPlants();
  }

  async loadPlants() {
    const all = await this.db.getAllPlants();
    this.plants.set(all);
  }

  onSearchChange(value: string) {
    this.searchQuery.set(value);
  }

  async deleteCard(event: Event, plant: Plant) {
    event.preventDefault();
    event.stopPropagation();
    const msg = this.translate.instant('plant_list.delete_confirm', { name: plant.name });
    if (!window.confirm(msg)) return;
    await this.db.deletePlant(plant.id!);
    await this.loadPlants();
  }

  locationLabel(loc: Plant['plantingLocation']): string {
    const key = {
      sun: 'location.sun',
      'partial-sun': 'location.partial_sun',
      shade: 'location.shade',
    }[loc];
    return this.translate.instant(key);
  }

  plantStatus(plant: Plant): DueStatus {
    return worstStatus(plant);
  }

  statusLabel(status: DueStatus): string {
    switch (status) {
      case 'overdue':
        return this.translate.instant('status.overdue');
      case 'due-today':
        return this.translate.instant('status.due_today');
      case 'due-soon':
        return this.translate.instant('status.due_soon');
      default:
        return '';
    }
  }

  nextDueNote(plant: Plant): string {
    const tasks: { labelKey: string; task: Plant['careSchedule']['watering'] }[] = [
      { labelKey: 'care_task.watering', task: plant.careSchedule.watering },
      { labelKey: 'care_task.pruning', task: plant.careSchedule.pruning },
      { labelKey: 'care_task.fertilizing', task: plant.careSchedule.fertilizing },
    ];
    let best: { labelKey: string; days: number } | null = null;
    for (const { labelKey, task } of tasks) {
      const d = daysUntilDue(task);
      if (d !== null && (best === null || d < best.days)) {
        best = { labelKey, days: d };
      }
    }
    if (!best) return '';
    const label = this.translate.instant(best.labelKey);
    if (best.days < 0)
      return this.translate.instant('due.task_overdue', { label, days: Math.abs(best.days) });
    if (best.days === 0) return this.translate.instant('due.task_today', { label });
    return this.translate.instant('due.task_in_days', { label, days: best.days });
  }
}
