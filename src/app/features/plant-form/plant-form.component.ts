import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InputComponent, SelectComponent, TextareaComponent, ButtonComponent } from '@ui';
import { PlantingLocationIconComponent } from '../../components/planting-location-icon/planting-location-icon.component';
import { DbService } from '../../services/db.service';
import { Plant, CARE_INTERVALS, CareTask, CareInterval, LinkEntry } from '../../models/plant.model';
import { PlantIdService, PlantIdResult, PlantIdError } from '../../services/plant-id.service';
import { PremiumService } from '../../services/premium.service';
import { resizeImage } from '../../utils/image-resize';

const INTERVAL_KEY_MAP: Record<CareInterval, string> = {
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

@Component({
  selector: 'app-plant-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslateModule, InputComponent, SelectComponent, TextareaComponent, ButtonComponent, PlantingLocationIconComponent],
  templateUrl: './plant-form.component.html',
  styleUrl: './plant-form.component.scss',
})
export class PlantFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private db = inject(DbService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  plantId = inject(PlantIdService);
  premium = inject(PremiumService);

  isEdit = signal(false);
  editId = signal<number | null>(null);
  submitting = signal(false);
  locationSuggestions = signal<string[]>([]);
  identifying = signal(false);
  identificationResult = signal<PlantIdResult | null>(null);
  identificationError = signal<string | null>(null);

  readonly intervals = CARE_INTERVALS.map(i => ({ value: i.value, labelKey: INTERVAL_KEY_MAP[i.value] }));
  readonly locationOptions = [
    { value: 'sun' as const,         labelKey: 'location.sun' },
    { value: 'partial-sun' as const, labelKey: 'location.partial_sun' },
    { value: 'shade' as const,       labelKey: 'location.shade' },
  ];
  readonly careTasks = [
    { key: 'watering',    labelKey: 'care_task.watering',    icon: '💧' },
    { key: 'pruning',     labelKey: 'care_task.pruning',     icon: '✂️' },
    { key: 'fertilizing', labelKey: 'care_task.fertilizing', icon: '🌱' },
  ] as const;
  readonly today = new Date().toISOString().split('T')[0];

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    location: [''],
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

  selectLocation(value: Plant['plantingLocation']) {
    this.form.get('plantingLocation')?.setValue(value);
  }

  onLocationKeydown(event: KeyboardEvent) {
    const values = this.locationOptions.map(o => o.value);
    const current = this.form.get('plantingLocation')?.value;
    const idx = values.indexOf(current);
    let next: number | null = null;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      next = (idx + 1) % values.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = (idx - 1 + values.length) % values.length;
    }

    if (next !== null) {
      event.preventDefault();
      this.selectLocation(values[next]);
      const group = (event.currentTarget as HTMLElement);
      const buttons = group.querySelectorAll<HTMLButtonElement>('[role="radio"]');
      buttons[next]?.focus();
    }
  }

  async ngOnInit() {
    const allPlants = await this.db.getAllPlants();
    const locations = [...new Set(allPlants.map(p => p.location?.trim()).filter((l): l is string => !!l))];
    this.locationSuggestions.set(locations);

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.editId.set(Number(id));
      const plant = await this.db.getPlant(Number(id));
      if (plant) {
        this.form.patchValue({
          name: plant.name,
          location: plant.location ?? '',
          plantingLocation: plant.plantingLocation,
          photo: plant.photo ?? '',
          careSchedule: {
            watering:    plant.careSchedule.watering,
            pruning:     plant.careSchedule.pruning,
            fertilizing: plant.careSchedule.fertilizing,
          },
          notes: plant.notes,
        });
        plant.links.forEach(link => this.linksArray.push(this.buildLinkGroup(link)));
      }
    }
  }

  private buildLinkGroup(link?: LinkEntry): FormGroup {
    return this.fb.group({
      url: [link?.url ?? ''],
      title: [link?.title ?? ''],
      addedAt: [link?.addedAt ?? new Date().toISOString().split('T')[0]],
    });
  }

  addLink() {
    this.linksArray.push(this.buildLinkGroup());
  }

  removeLink(index: number) {
    this.linksArray.removeAt(index);
  }

  removePhoto() {
    this.form.patchValue({ photo: '' });
    this.identificationResult.set(null);
    this.identificationError.set(null);
  }

  async identifyPlant() {
    const photo = this.form.get('photo')?.value;
    if (!photo || this.identifying()) return;

    this.identifying.set(true);
    this.identificationResult.set(null);
    this.identificationError.set(null);

    try {
      const resized = await resizeImage(photo);
      const result = await this.plantId.identify(resized);
      this.identificationResult.set(result);
      const displayName = result.commonNames.length > 0 ? result.commonNames[0] : result.name;
      this.form.patchValue({ name: displayName });
    } catch (err) {
      const errorKey = typeof err === 'string' ? err : 'unknown';
      const errorMap: Record<string, string> = {
        'offline': 'plant_form.identify_error_offline',
        'no-result': 'plant_form.identify_error_generic',
        'unknown': 'plant_form.identify_error_generic',
      };
      this.identificationError.set(errorMap[errorKey] ?? 'plant_form.identify_error_generic');
    } finally {
      this.identifying.set(false);
    }
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
          location: values.location?.trim() || undefined,
          plantingLocation: values.plantingLocation,
          photo: values.photo || undefined,
          careSchedule: values.careSchedule,
          notes: values.notes,
          links: values.links.filter((l: LinkEntry) => l.url.trim()),
          updatedAt: now,
        };
        await this.db.updatePlant(updated);
      } else {
        const plant: Omit<Plant, 'id'> = {
          name: values.name,
          location: values.location?.trim() || undefined,
          plantingLocation: values.plantingLocation,
          photo: values.photo || undefined,
          careSchedule: values.careSchedule,
          notes: values.notes,
          links: values.links.filter((l: LinkEntry) => l.url.trim()),
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
