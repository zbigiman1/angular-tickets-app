import { inject, Injectable, OnDestroy } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LanguageService implements OnDestroy {
  readonly supportedLangs = ['en', 'pl'];
  private translate = inject(TranslateService);
  private currentLang$ = new BehaviorSubject<string>('en');
  private langSub?: Subscription;

  constructor() {
    this.translate.addLangs(this.supportedLangs);

    this.langSub = this.translate.onLangChange.subscribe((e: LangChangeEvent) => {
      this.currentLang$.next(e.lang);
      try {
        localStorage.setItem('lang', e.lang);
      } catch (err) {
        // ignore storage errors
      }
    });
  }

  init(): void {
    const stored = this.getStoredLang();
    if (stored && this.supportedLangs.includes(stored)) {
      this.translate.use(stored);
      this.currentLang$.next(stored);
      return;
    }

    const browser = this.translate.getBrowserLang() || '';
    const initial = this.supportedLangs.includes(browser) ? browser : 'en';
    this.translate.use(initial);
    this.currentLang$.next(initial);
  }

  setLanguage(lang: string): void {
    if (!this.supportedLangs.includes(lang)) return;
    this.translate.use(lang);
  }

  getCurrentLang(): string {
    return this.currentLang$.value;
  }

  currentLangChanges() {
    return this.currentLang$.asObservable();
  }

  private getStoredLang(): string | null {
    try {
      return localStorage.getItem('lang');
    } catch (err) {
      return null;
    }
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }
}
