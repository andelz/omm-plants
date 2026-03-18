import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const PROXY_URL = 'http://localhost:3000';

export interface PlantIdResult {
  name: string;
  commonNames: string[];
  probability: number;
}

export type PlantIdError = 'offline' | 'no-result' | 'unknown';

@Injectable({ providedIn: 'root' })
export class PlantIdService {
  private translate = inject(TranslateService);

  async identify(base64Image: string): Promise<PlantIdResult> {
    if (!navigator.onLine) {
      throw 'offline' as PlantIdError;
    }

    const blob = this.base64ToBlob(base64Image);
    const lang = this.translate.currentLang || 'en';

    const formData = new FormData();
    formData.append('images', blob, 'plant.jpg');
    formData.append('organs', 'auto');

    let response: Response;
    try {
      response = await fetch(`${PROXY_URL}/identify?lang=${lang}`, {
        method: 'POST',
        body: formData,
      });
    } catch {
      throw 'offline' as PlantIdError;
    }

    if (!response.ok) {
      throw 'unknown' as PlantIdError;
    }

    const data = await response.json();
    const result = data?.results?.[0];

    if (!result) {
      throw 'no-result' as PlantIdError;
    }

    return {
      name: result.name ?? '',
      commonNames: result.commonNames ?? [],
      probability: result.score ?? 0,
    };
  }

  private base64ToBlob(base64DataUrl: string): Blob {
    const parts = base64DataUrl.split(',');
    const mime = parts[0]?.match(/:(.*?);/)?.[1] ?? 'image/jpeg';
    const raw = atob(parts[1]);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      bytes[i] = raw.charCodeAt(i);
    }
    return new Blob([bytes], { type: mime });
  }
}
