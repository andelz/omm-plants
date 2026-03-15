import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { marker } from 'ngx-translate-extract-marker';
import { DbService } from '../../services/db.service';
import { Plant, CareTask, daysUntilDue, dueStatus, DueStatus, CARE_INTERVALS } from '../../models/plant.model';

// Marker-only block so ngx-translate-extract picks up keys used via dynamic variables in templates
marker('plant_detail.not_found'); marker('plant_detail.back_to_plants'); marker('plant_detail.back');
marker('plant_detail.edit'); marker('plant_detail.delete'); marker('plant_detail.search_link');
marker('plant_detail.care_schedule'); marker('plant_detail.notes'); marker('plant_detail.links');
marker('plant_detail.added'); marker('plant_detail.updated');
marker('plant_detail.done_today'); marker('plant_detail.last'); marker('plant_detail.never_done');

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
    { key: 'watering',    labelKey: marker('care_task.watering'),    icon: '💧' },
    { key: 'pruning',     labelKey: marker('care_task.pruning'),     icon: '✂️' },
    { key: 'fertilizing', labelKey: marker('care_task.fertilizing'), icon: '🌱' },
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
    const msg = this.translate.instant(marker('plant_detail.delete_confirm'), { name: p.name });
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
    const key = {
      sun: marker('location.sun'),
      'partial-sun': marker('location.partial_sun'),
      shade: marker('location.shade'),
    }[loc];
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
      'daily':          marker('care_interval.daily'),
      'every-2-days':   marker('care_interval.every_2_days'),
      'every-3-days':   marker('care_interval.every_3_days'),
      'weekly':         marker('care_interval.weekly'),
      'every-2-weeks':  marker('care_interval.every_2_weeks'),
      'monthly':        marker('care_interval.monthly'),
      'seasonally':     marker('care_interval.seasonally'),
      'yearly':         marker('care_interval.yearly'),
      'as-needed':      marker('care_interval.as_needed'),
    };
    return this.translate.instant(keyMap[task.interval] ?? task.interval);
  }

  dueLabel(task: CareTask): string {
    const days = daysUntilDue(task);
    if (days === null) return '';
    if (days < 0) return this.translate.instant(marker('due.overdue'), { days: Math.abs(days) });
    if (days === 0) return this.translate.instant(marker('due.today'));
    return this.translate.instant(marker('due.in_days'), { days });
  }

  taskStatus(task: CareTask): DueStatus {
    return dueStatus(task);
  }

  searchUrl(name: string): string {
    return `https://www.google.com/search?q=${encodeURIComponent(name + ' plant care')}`;
  }
}
