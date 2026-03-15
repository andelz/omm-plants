import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DbService } from '../../services/db.service';
import { Plant, CareTask, daysUntilDue, dueStatus, DueStatus, CARE_INTERVALS } from '../../models/plant.model';

@Component({
  selector: 'app-plant-detail',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './plant-detail.component.html',
  styleUrl: './plant-detail.component.scss',
})
export class PlantDetailComponent implements OnInit {
  private db = inject(DbService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private translate = inject(TranslateService);

  plant = signal<Plant | null>(null);
  notFound = signal(false);

  readonly careTasks = [
    { key: 'watering',    labelKey: 'CARE_TASK.WATERING',    icon: '💧' },
    { key: 'pruning',     labelKey: 'CARE_TASK.PRUNING',     icon: '✂️' },
    { key: 'fertilizing', labelKey: 'CARE_TASK.FERTILIZING', icon: '🌱' },
  ] as const;

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
    const msg = this.translate.instant('PLANT_DETAIL.DELETE_CONFIRM', { name: p.name });
    if (!window.confirm(msg)) return;
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
    const key = { sun: 'LOCATION.SUN', 'partial-sun': 'LOCATION.PARTIAL_SUN', shade: 'LOCATION.SHADE' }[loc];
    return this.translate.instant(key);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }

  intervalLabel(task: CareTask): string {
    if (!task.interval) return '—';
    const intervalDef = CARE_INTERVALS.find(i => i.value === task.interval);
    if (!intervalDef) return task.interval;
    const keyMap: Record<string, string> = {
      'daily':          'CARE_INTERVAL.DAILY',
      'every-2-days':   'CARE_INTERVAL.EVERY_2_DAYS',
      'every-3-days':   'CARE_INTERVAL.EVERY_3_DAYS',
      'weekly':         'CARE_INTERVAL.WEEKLY',
      'every-2-weeks':  'CARE_INTERVAL.EVERY_2_WEEKS',
      'monthly':        'CARE_INTERVAL.MONTHLY',
      'seasonally':     'CARE_INTERVAL.SEASONALLY',
      'yearly':         'CARE_INTERVAL.YEARLY',
      'as-needed':      'CARE_INTERVAL.AS_NEEDED',
    };
    return this.translate.instant(keyMap[task.interval] ?? task.interval);
  }

  dueLabel(task: CareTask): string {
    const days = daysUntilDue(task);
    if (days === null) return '';
    if (days < 0) return this.translate.instant('DUE.OVERDUE', { days: Math.abs(days) });
    if (days === 0) return this.translate.instant('DUE.TODAY');
    return this.translate.instant('DUE.IN_DAYS', { days });
  }

  taskStatus(task: CareTask): DueStatus {
    return dueStatus(task);
  }

  searchUrl(name: string): string {
    return `https://www.google.com/search?q=${encodeURIComponent(name + ' plant care')}`;
  }
}
