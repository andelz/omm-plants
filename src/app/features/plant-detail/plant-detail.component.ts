import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonComponent, BadgeComponent } from '@ui';
import { DbService } from '../../services/db.service';
import { Plant, CareTask, daysUntilDue, dueStatus, DueStatus, CARE_INTERVALS } from '../../models/plant.model';
import { PlantingLocationIconComponent } from '../../components/planting-location-icon/planting-location-icon.component';

@Component({
  selector: 'app-plant-detail',
  standalone: true,
  imports: [RouterLink, TranslateModule, ButtonComponent, BadgeComponent, PlantingLocationIconComponent],
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
    { key: 'watering',    labelKey: 'care_task.watering',    icon: '💧' },
    { key: 'pruning',     labelKey: 'care_task.pruning',     icon: '✂️' },
    { key: 'fertilizing', labelKey: 'care_task.fertilizing', icon: '🌱' },
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
    const msg = this.translate.instant('plant_detail.delete_confirm', { name: p.name });
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
      sun: 'location.sun',
      'partial-sun': 'location.partial_sun',
      shade: 'location.shade',
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
      'daily':          'care_interval.daily',
      'every-2-days':   'care_interval.every_2_days',
      'every-3-days':   'care_interval.every_3_days',
      'weekly':         'care_interval.weekly',
      'every-2-weeks':  'care_interval.every_2_weeks',
      'monthly':        'care_interval.monthly',
      'seasonally':     'care_interval.seasonally',
      'yearly':         'care_interval.yearly',
      'as-needed':      'care_interval.as_needed',
    };
    return this.translate.instant(keyMap[task.interval] ?? task.interval);
  }

  dueLabel(task: CareTask): string {
    const days = daysUntilDue(task);
    if (days === null) return '';
    if (days < 0) return this.translate.instant('due.overdue', { days: Math.abs(days) });
    if (days === 0) return this.translate.instant('due.today');
    return this.translate.instant('due.in_days', { days });
  }

  taskStatus(task: CareTask): DueStatus {
    return dueStatus(task);
  }

  searchUrl(name: string): string {
    return `https://www.google.com/search?q=${encodeURIComponent(name + ' plant care')}`;
  }

  faviconUrl(url: string): string {
    try {
      const host = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${host}&sz=32`;
    } catch {
      return '';
    }
  }

  domainOf(url: string): string {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  }

  formatLinkDate(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
