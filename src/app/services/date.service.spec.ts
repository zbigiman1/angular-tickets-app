import { LanguageService } from '@/app/services/language.service';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { DateService } from './date.service';

class MockLanguageService {
  private subj = new BehaviorSubject<string>('en');
  getCurrentLang() {
    return this.subj.value;
  }
  currentLangChanges() {
    return this.subj.asObservable();
  }
  setLang(l: string) {
    this.subj.next(l);
  }
}

describe('DateService', () => {
  let service: DateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateService, { provide: LanguageService, useClass: MockLanguageService }],
    });
  });

  it('formats date for en locale', () => {
    const mockLang = TestBed.inject(LanguageService) as unknown as MockLanguageService;
    mockLang.setLang('en');
    service = TestBed.inject(DateService);
    const out = service.format('2020-01-02T15:04:00Z');
    expect(out).toContain('2020');
  });

  it('formats date for pl locale', () => {
    const mockLang = TestBed.inject(LanguageService) as unknown as MockLanguageService;
    mockLang.setLang('pl');
    service = TestBed.inject(DateService);
    const out = service.format('2020-01-02T15:04:00Z');
    expect(out).toContain('2020');
  });
});
