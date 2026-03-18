import { Injectable, signal } from '@angular/core';

const PREMIUM_KEY = 'premium-enabled';

@Injectable({ providedIn: 'root' })
export class PremiumService {
  readonly enabled = signal(localStorage.getItem(PREMIUM_KEY) === 'true');

  toggle(): void {
    const next = !this.enabled();
    this.enabled.set(next);
    localStorage.setItem(PREMIUM_KEY, String(next));
  }
}
