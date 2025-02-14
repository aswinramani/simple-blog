import { ApplicationConfig } from '@angular/core';
import { AuthInterceptor } from './interceptor/token.interceptor';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
};
