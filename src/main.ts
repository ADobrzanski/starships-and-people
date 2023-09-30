import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { STAR_WARS_API_BASE_URL } from '@core/tokens/star-wars-api-base-url.token';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    { provide: STAR_WARS_API_BASE_URL, useValue: 'https://swapi.tech/api' },
  ],
}).catch((err) => console.error(err));
