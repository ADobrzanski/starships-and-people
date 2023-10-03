import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { STAR_WARS_API_BASE_URL } from '@/core/tokens/star-wars-api-base-url.token';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, HttpClientModule),
    { provide: STAR_WARS_API_BASE_URL, useValue: 'https://swapi.tech/api' },
    provideAnimations(),
  ],
}).catch((err) => console.error(err));
