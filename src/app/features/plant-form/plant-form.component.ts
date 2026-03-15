import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { marker } from 'ngx-translate-extract-marker';
import { DbService } from '../../services/db.service';
import { Plant, CARE_INTERVALS, CareTask, CareInterval } from '../../models/plant.model';

// Marker-only block so ngx-translate-extract picks up keys used in ternary template expressions
marker('plant_form.title_add'); marker('plant_form.title_edit');
marker('plant_form.back'); marker('plant_form.name_label'); marker('plant_form.name_placeholder');
marker('plant_form.name_required'); marker('plant_form.location_label');
marker('plant_form.photo_label'); marker('plant_form.photo_choose'); marker('plant_form.photo_take');
marker('plant_form.photo_remove'); marker('plant_form.photo_preview_alt');
marker('plant_form.care_schedule_legend'); marker('plant_form.care_schedule_hint');
marker('plant_form.interval_label'); marker('plant_form.interval_not_set'); marker('plant_form.last_done_label');
marker('plant_form.links_label'); marker('plant_form.link_placeholder');
marker('plant_form.link_remove'); marker('plant_form.link_add');
marker('plant_form.notes_label'); marker('plant_form.notes_placeholder');
marker('plant_form.cancel'); marker('plant_form.save'); marker('plant_form.update'); marker('plant_form.saving');
marker('location.sun'); marker('location.partial_sun'); marker('location.shade');

const INTERVAL_KEY_MAP: Record<CareInterval, string> = {
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

@Component({
  selector: 'app-plant-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './plant-form.component.html',
  styleUrl: './plant-form.component.scss',
})
export class PlantFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private db = inject(DbService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEdit = signal(false);
  editId = signal<number | null>(null);
  submitting = signal(false);

  readonly intervals = CARE_INTERVALS.map(i => ({ value: i.value, labelKey: INTERVAL_KEY_MAP[i.value] }));
  readonly careTasks = [
    { key: 'watering',    labelKey: marker('care_task.watering'),    icon: '💧' },
    { key: 'pruning',     labelKey: marker('care_task.pruning'),     icon: '✂️' },
    { key: 'fertilizing', labelKey: marker('care_task.fertilizing'), icon: '🌱' },
  ] as const;
  readonly today = new Date().toISOString().split('T')[0];

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    plantingLocation: ['sun', Validators.required],
    photo: [''],
    careSchedule: this.fb.group({
      watering:    this.buildCareGroup(),
      pruning:     this.buildCareGroup(),
      fertilizing: this.buildCareGroup(),
    }),
    notes: [''],
    links: this.fb.array([]),
  });

  private buildCareGroup(task?: CareTask): FormGroup {
    return this.fb.group({
      interval: [task?.interval ?? ''],
      lastDone: [task?.lastDone ?? null],
    });
  }

  get linksArray(): FormArray {
    return this.form.get('links') as FormArray;
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.editId.set(Number(id));
      const plant = await this.db.getPlant(Number(id));
      if (plant) {
        this.form.patchValue({
          name: plant.name,
          plantingLocation: plant.plantingLocation,
          photo: plant.photo ?? '',
          careSchedule: {
            watering:    plant.careSchedule.watering,
            pruning:     plant.careSchedule.pruning,
            fertilizing: plant.careSchedule.fertilizing,
          },
          notes: plant.notes,
        });
        plant.links.forEach(link => this.linksArray.push(this.fb.control(link)));
      }
    }
  }

  addLink() {
    this.linksArray.push(this.fb.control(''));
  }

  removeLink(index: number) {
    this.linksArray.removeAt(index);
  }

  removePhoto() {
    this.form.patchValue({ photo: '' });
  }

  onPhotoChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.form.patchValue({ photo: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  async onSubmit() {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const now = new Date();
    const values = this.form.value;

    try {
      if (this.isEdit() && this.editId() !== null) {
        const existing = await this.db.getPlant(this.editId()!);
        const updated: Plant = {
          ...existing!,
          name: values.name,
          plantingLocation: values.plantingLocation,
          photo: values.photo || undefined,
          careSchedule: values.careSchedule,
          notes: values.notes,
          links: values.links.filter((l: string) => l.trim()),
          updatedAt: now,
        };
        await this.db.updatePlant(updated);
      } else {
        const plant: Omit<Plant, 'id'> = {
          name: values.name,
          plantingLocation: values.plantingLocation,
          photo: values.photo || undefined,
          careSchedule: values.careSchedule,
          notes: values.notes,
          links: values.links.filter((l: string) => l.trim()),
          createdAt: now,
          updatedAt: now,
        };
        await this.db.addPlant(plant);
      }
      this.router.navigate(['/plants']);
    } finally {
      this.submitting.set(false);
    }
  }
}
