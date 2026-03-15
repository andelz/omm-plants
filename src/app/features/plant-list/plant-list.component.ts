import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { marker } from 'ngx-translate-extract-marker';
import { DbService } from '../../services/db.service';
import { Plant, worstStatus, DueStatus, daysUntilDue } from '../../models/plant.model';

// Marker-only block for keys used via pipe in templates
marker('PLANT_LIST.TITLE'); marker('PLANT_LIST.ADD_PLANT');
marker('PLANT_LIST.SEARCH_PLACEHOLDER'); marker('PLANT_LIST.SEARCH_LABEL');
marker('PLANT_LIST.EMPTY_NO_PLANTS'); marker('PLANT_LIST.EMPTY_ADD_FIRST'); marker('PLANT_LIST.EMPTY_NO_MATCH');
marker('PLANT_LIST.DELETE');

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
    const msg = this.translate.instant(marker('PLANT_LIST.DELETE_CONFIRM'), { name: plant.name });
    if (!window.confirm(msg)) return;
    await this.db.deletePlant(plant.id!);
    await this.loadPlants();
  }

  locationLabel(loc: Plant['plantingLocation']): string {
    const key = {
      sun: marker('LOCATION.SUN'),
      'partial-sun': marker('LOCATION.PARTIAL_SUN'),
      shade: marker('LOCATION.SHADE'),
    }[loc];
    return this.translate.instant(key);
  }

  plantStatus(plant: Plant): DueStatus {
    return worstStatus(plant);
  }

  statusLabel(status: DueStatus): string {
    switch (status) {
      case 'overdue':
        return this.translate.instant(marker('STATUS.OVERDUE'));
      case 'due-today':
        return this.translate.instant(marker('STATUS.DUE_TODAY'));
      case 'due-soon':
        return this.translate.instant(marker('STATUS.DUE_SOON'));
      default:
        return '';
    }
  }

  nextDueNote(plant: Plant): string {
    const tasks: { labelKey: string; task: Plant['careSchedule']['watering'] }[] = [
      { labelKey: marker('CARE_TASK.WATERING'), task: plant.careSchedule.watering },
      { labelKey: marker('CARE_TASK.PRUNING'), task: plant.careSchedule.pruning },
      { labelKey: marker('CARE_TASK.FERTILIZING'), task: plant.careSchedule.fertilizing },
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
      return this.translate.instant(marker('DUE.TASK_OVERDUE'), { label, days: Math.abs(best.days) });
    if (best.days === 0) return this.translate.instant(marker('DUE.TASK_TODAY'), { label });
    return this.translate.instant(marker('DUE.TASK_IN_DAYS'), { label, days: best.days });
  }
}
