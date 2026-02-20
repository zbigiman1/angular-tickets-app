import { LanguageService } from '@/services/language.service';
import { Component, Inject, OnDestroy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [TranslateModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnDestroy {
  currentLang = 'en';
  private langSub?: Subscription;

  constructor(@Inject(LanguageService) private languageService: LanguageService) {
    this.currentLang = this.languageService.getCurrentLang() || 'en';

    this.langSub = this.languageService.currentLangChanges().subscribe((lang: string) => {
      this.currentLang = lang;
    });
  }

  switchLang(lang: string) {
    this.languageService.setLanguage(lang);
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }
}
