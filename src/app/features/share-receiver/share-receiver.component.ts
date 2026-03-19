import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '@ui';
import { ShareIntentService } from '../../services/share-intent.service';
import { DbService } from '../../services/db.service';
import { Plant } from '../../models/plant.model';

@Component({
  selector: 'app-share-receiver',
  standalone: true,
  imports: [FormsModule, RouterLink, TranslateModule, ButtonComponent],
  templateUrl: './share-receiver.component.html',
  styleUrl: './share-receiver.component.scss',
})
export class ShareReceiverComponent implements OnInit {
  private shareIntent = inject(ShareIntentService);
  private db = inject(DbService);
  private router = inject(Router);

  sharedUrl = signal('');
  sharedTitle = signal('');
  plants = signal<Plant[]>([]);
  searchQuery = signal('');
  saving = signal(false);

  filteredPlants = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    return q
      ? this.plants().filter(p => p.name.toLowerCase().includes(q))
      : this.plants();
  });

  async ngOnInit() {
    const data = this.shareIntent.consumePending();
    if (!data) {
      this.router.navigate(['/plants']);
      return;
    }
    this.sharedUrl.set(ShareIntentService.resolveUrl(data));
    this.sharedTitle.set(data.title || this.sharedUrl());
    this.plants.set(await this.db.getAllPlants());
  }

  onSearchChange(value: string) {
    this.searchQuery.set(value);
  }

  async selectPlant(plant: Plant) {
    if (this.saving()) return;
    this.saving.set(true);
    const url = this.sharedUrl();
    if (!plant.links.some(l => l.url === url)) {
      plant.links.push({
        url,
        title: this.sharedTitle() !== url ? this.sharedTitle() : undefined,
        addedAt: new Date().toISOString().split('T')[0],
      });
    }
    plant.updatedAt = new Date();
    await this.db.updatePlant(plant);
    this.router.navigate(['/plants', plant.id]);
  }
}
