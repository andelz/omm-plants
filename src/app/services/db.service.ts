import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Plant, CareTask } from '../models/plant.model';

interface PlantsDB extends DBSchema {
  plants: {
    key: number;
    value: Plant;
  };
}

function emptyCareTask(): CareTask {
  return { interval: '', lastDone: null };
}

/** Migrate records that may have old string-based careSchedule fields. */
function migratePlant(raw: any): Plant {
  const cs = raw.careSchedule ?? {};
  return {
    ...raw,
    careSchedule: {
      watering:    typeof cs.watering    === 'object' ? cs.watering    : emptyCareTask(),
      pruning:     typeof cs.pruning     === 'object' ? cs.pruning     : emptyCareTask(),
      fertilizing: typeof cs.fertilizing === 'object' ? cs.fertilizing : emptyCareTask(),
    },
  };
}

@Injectable({ providedIn: 'root' })
export class DbService {
  private dbPromise: Promise<IDBPDatabase<PlantsDB>>;

  constructor() {
    this.dbPromise = openDB<PlantsDB>('plants-db', 2, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          db.createObjectStore('plants', { keyPath: 'id', autoIncrement: true });
        }
        // v2: careSchedule fields changed from string to CareTask — migrated at read time
      },
    });
  }

  async getAllPlants(): Promise<Plant[]> {
    const db = await this.dbPromise;
    const raw = await db.getAll('plants');
    return raw.map(migratePlant);
  }

  async getPlant(id: number): Promise<Plant | undefined> {
    const db = await this.dbPromise;
    const raw = await db.get('plants', id);
    return raw ? migratePlant(raw) : undefined;
  }

  async addPlant(plant: Omit<Plant, 'id'>): Promise<number> {
    const db = await this.dbPromise;
    return db.add('plants', plant as Plant);
  }

  async updatePlant(plant: Plant): Promise<number> {
    const db = await this.dbPromise;
    return db.put('plants', plant);
  }

  async deletePlant(id: number): Promise<void> {
    const db = await this.dbPromise;
    return db.delete('plants', id);
  }

  async clearAll(): Promise<void> {
    const db = await this.dbPromise;
    return db.clear('plants');
  }
}
