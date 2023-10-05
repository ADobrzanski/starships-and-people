import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { STAR_WARS_API_BASE_URL } from '@/core/tokens/star-wars-api-base-url.token';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { environment } from './environment/environment';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, HttpClientModule),
    {
      provide: STAR_WARS_API_BASE_URL,
      useValue: environment.startWarsApiBaseUrl,
    },
    provideAnimations(),
  ],
}).catch((err) => console.error(err));
