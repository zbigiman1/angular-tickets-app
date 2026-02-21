import { TestBed } from '@angular/core/testing';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { LanguageService } from './language.service';

class MockTranslateService {
  onLangChange = new Subject<LangChangeEvent>();
  addedLangs: string[] = [];
  lastUsed: string | null = null;
  browserLang: string | null = 'en';

  addLangs(langs: string[]) { this.addedLangs = langs; }
  use(lang: string) { this.lastUsed = lang; }
  getBrowserLang() { return this.browserLang; }
}

describe('LanguageService', () => {
  let service: LanguageService;
  let translate: MockTranslateService;

  beforeEach(() => {
    // make sure no lingering value in localStorage
    try { localStorage.removeItem('lang'); } catch {}

    TestBed.configureTestingModule({
      providers: [
        LanguageService,
        { provide: TranslateService, useClass: MockTranslateService }
      ]
    });

    translate = TestBed.inject(TranslateService) as unknown as MockTranslateService;
    service = TestBed.inject(LanguageService);
  });

  afterEach(() => {
    try { localStorage.removeItem('lang'); } catch {}
  });

  it('reads stored lang on init when present', () => {
    localStorage.setItem('lang', 'pl');
    service.init();
    expect(translate.lastUsed).toBe('pl');
    expect(service.getCurrentLang()).toBe('pl');
  });

  it('falls back to browser lang when no stored lang', () => {
    // ensure no stored lang
    localStorage.removeItem('lang');
    translate.browserLang = 'en';
    service.init();
    expect(translate.lastUsed).toBe('en');
    expect(service.getCurrentLang()).toBe('en');
  });

  it('setLanguage calls translate.use when supported', () => {
    service.setLanguage('pl');
    expect(translate.lastUsed).toBe('pl');
  });

  it('updates currentLang and localStorage when onLangChange fires', () => {
    translate.onLangChange.next({ lang: 'pl', translations: {} } as LangChangeEvent);
    expect(service.getCurrentLang()).toBe('pl');
    expect(localStorage.getItem('lang')).toBe('pl');
  });
});
