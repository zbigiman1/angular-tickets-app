import { LanguageService } from '@/app/services/language.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DateService {
  private currentLang = 'pl';

  constructor(private languageService: LanguageService) {
    const stored = this.languageService.getCurrentLang();
    this.currentLang = stored || 'pl';
    // subscribe to changes so service always has the latest locale
    this.languageService.currentLangChanges().subscribe((lang: string) => {
      this.currentLang = lang;
    });
  }

  format(dateString: string | undefined, locale?: string): string {
    const localeKey = locale || this.currentLang || 'pl';
    let dateFormat = 'pl-PL';
    if (localeKey === 'en') {
      dateFormat = 'en-US';
    }

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };

    return new Date(dateString as string).toLocaleDateString(dateFormat, options);
  }
}
