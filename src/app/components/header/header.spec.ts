import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageService } from '@/services/language.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { Header } from './header';

class MockLanguageService {
  private subj = new BehaviorSubject<string>('en');
  getCurrentLang() {
    return this.subj.value;
  }
  currentLangChanges() {
    return this.subj.asObservable();
  }
  setLanguage(lang: string) {
    this.subj.next(lang);
  }
}

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let mockLang: MockLanguageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header, TranslateModule.forRoot()],
      providers: [provideHttpClientTesting(), { provide: LanguageService, useClass: MockLanguageService }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    mockLang = TestBed.inject(LanguageService) as unknown as MockLanguageService;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calls languageService.setLanguage when switchLang is called', () => {
  const calls: string[] = [];
  (mockLang as any).setLanguage = (lang: string) => { calls.push(lang); };
  component.switchLang('pl');
  expect(calls).toEqual(['pl']);
  });

  it('updates the active button when language changes', async () => {
    // initial should be EN
    const buttons: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('.locale-switcher button'));
    expect(buttons[0].textContent!.trim()).toBe('EN');

    // simulate user clicking the PL button
    buttons[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    const active = fixture.nativeElement.querySelector('.locale-switcher button.active');
    expect(active.textContent.trim()).toBe('PL');
  });
});
