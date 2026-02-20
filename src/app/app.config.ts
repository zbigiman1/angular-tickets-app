import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { routes } from './app.routes';

// Simple TranslateLoader using Angular HttpClient to load JSON files from assets/i18n
export function createTranslateLoader(http: HttpClient): TranslateLoader {
  return {
    getTranslation: (lang: string) => http.get<Record<string, string>>(`./assets/i18n/${lang}.json`)
  } as TranslateLoader;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
        },
        fallbackLang: 'en'
      })
    )
  ]
};
