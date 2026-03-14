import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { DbService } from '../../services/db.service';
import { Plant, CareTask, daysUntilDue, dueStatus, DueStatus, CARE_INTERVALS } from '../../models/plant.model';

@Component({
  selector: 'app-plant-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './plant-detail.component.html',
  styleUrl: './plant-detail.component.scss',
})
export class PlantDetailComponent implements OnInit {
  private db = inject(DbService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  plant = signal<Plant | null>(null);
  notFound = signal(false);

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const plant = await this.db.getPlant(id);
    if (plant) {
      this.plant.set(plant);
    } else {
      this.notFound.set(true);
    }
  }

  async deleteplant() {
    const p = this.plant();
    if (!p) return;
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    await this.db.deletePlant(p.id!);
    this.router.navigate(['/plants']);
  }

  async markDone(key: 'watering' | 'pruning' | 'fertilizing') {
    const p = this.plant();
    if (!p) return;
    const today = new Date().toISOString().split('T')[0];
    const updated: Plant = {
      ...p,
      careSchedule: {
        ...p.careSchedule,
        [key]: { ...p.careSchedule[key], lastDone: today },
      },
      updatedAt: new Date(),
    };
    await this.db.updatePlant(updated);
    this.plant.set(updated);
  }

  locationLabel(loc: Plant['plantingLocation']): string {
    return { sun: 'Full Sun', 'partial-sun': 'Partial Sun', shade: 'Shade' }[loc];
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }

  intervalLabel(task: CareTask): string {
    if (!task.interval) return '—';
    return CARE_INTERVALS.find(i => i.value === task.interval)?.label ?? task.interval;
  }

  dueLabel(task: CareTask): string {
    const days = daysUntilDue(task);
    if (days === null) return '';
    if (days < 0) return `${Math.abs(days)}d overdue`;
    if (days === 0) return 'Due today';
    return `In ${days}d`;
  }

  taskStatus(task: CareTask): DueStatus {
    return dueStatus(task);
  }

  searchUrl(name: string): string {
    return `https://www.google.com/search?q=${encodeURIComponent(name + ' plant care')}`;
  }
}
