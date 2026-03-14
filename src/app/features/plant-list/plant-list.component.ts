import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DbService } from '../../services/db.service';
import { Plant, worstStatus, DueStatus, daysUntilDue } from '../../models/plant.model';

@Component({
  selector: 'app-plant-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './plant-list.component.html',
  styleUrl: './plant-list.component.scss',
})
export class PlantListComponent implements OnInit {
  private db = inject(DbService);

  plants = signal<Plant[]>([]);
  searchQuery = signal('');

  filteredPlants = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.plants();
    return this.plants().filter(p => p.name.toLowerCase().includes(q));
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
    if (!window.confirm(`Delete "${plant.name}"?`)) return;
    await this.db.deletePlant(plant.id!);
    await this.loadPlants();
  }

  locationLabel(loc: Plant['plantingLocation']): string {
    return { sun: 'Full Sun', 'partial-sun': 'Partial Sun', shade: 'Shade' }[loc];
  }

  plantStatus(plant: Plant): DueStatus {
    return worstStatus(plant);
  }

  statusLabel(status: DueStatus): string {
    switch (status) {
      case 'overdue':   return 'Overdue';
      case 'due-today': return 'Due today';
      case 'due-soon':  return 'Due soon';
      default:          return '';
    }
  }

  nextDueNote(plant: Plant): string {
    const tasks: { label: string; task: Plant['careSchedule']['watering'] }[] = [
      { label: 'Water', task: plant.careSchedule.watering },
      { label: 'Prune', task: plant.careSchedule.pruning },
      { label: 'Fertilize', task: plant.careSchedule.fertilizing },
    ];
    // Find the most urgent task
    let best: { label: string; days: number } | null = null;
    for (const { label, task } of tasks) {
      const d = daysUntilDue(task);
      if (d !== null && (best === null || d < best.days)) {
        best = { label, days: d };
      }
    }
    if (!best) return '';
    if (best.days < 0) return `${best.label}: ${Math.abs(best.days)}d overdue`;
    if (best.days === 0) return `${best.label}: due today`;
    return `${best.label}: in ${best.days}d`;
  }
}
