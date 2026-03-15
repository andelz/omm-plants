import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DbService } from '../../services/db.service';
import { Plant, CARE_INTERVALS, CareTask, CareInterval } from '../../models/plant.model';

const INTERVAL_KEY_MAP: Record<CareInterval, string> = {
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
    { key: 'watering',    labelKey: 'CARE_TASK.WATERING',    icon: '💧' },
    { key: 'pruning',     labelKey: 'CARE_TASK.PRUNING',     icon: '✂️' },
    { key: 'fertilizing', labelKey: 'CARE_TASK.FERTILIZING', icon: '🌱' },
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
