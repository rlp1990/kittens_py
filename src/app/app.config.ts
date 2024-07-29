import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideRouter,
  RouteReuseStrategy,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { provideNzI18n, en_US } from 'ng-zorro-antd/i18n';
import { FormDataInterceptor } from '../interceptors/form-data.interceptor';

export function initConfig() {
  registerLocaleData(en);
}

initConfig();

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({
        onSameUrlNavigation: 'reload',
      }),
    ),
    provideHttpClient(),
    provideNzI18n(en_US),
    /*{
      provide: HTTP_INTERCEPTORS,
      useClass: FormDataInterceptor,
      multi: true,
    },*/
    {
      provide: 'BASE_API_URL',
      useValue: environment.apiUrl,
    },
  ],
};
