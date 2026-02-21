import { LanguageService } from '@/services/language.service';
import { Component, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Layout } from './layout/layout/layout';

@Component({
  selector: 'app-root',
  imports: [Layout],
  templateUrl: './app.html',
})
export class App {
  constructor(
    private translate: TranslateService,
    @Inject(LanguageService) private languageService: LanguageService,
  ) {
    this.languageService.init();
  }
}
