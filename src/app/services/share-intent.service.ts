import { Injectable } from '@angular/core';

export interface ShareIntentData {
  url: string;
  title: string;
  text: string;
}

@Injectable({ providedIn: 'root' })
export class ShareIntentService {
  private pending: ShareIntentData | null = null;

  setPending(data: ShareIntentData): void {
    this.pending = data;
  }

  consumePending(): ShareIntentData | null {
    const data = this.pending;
    this.pending = null;
    return data;
  }

  hasPending(): boolean {
    return this.pending !== null;
  }

  static extractUrls(text: string): string[] {
    const urlRegex = /https?:\/\/[^\s)>\]]+/gi;
    return text.match(urlRegex) ?? [];
  }

  static resolveUrl(params: ShareIntentData): string {
    if (params.url) return params.url;
    const extracted = ShareIntentService.extractUrls(params.text);
    return extracted[0] ?? params.text;
  }
}
