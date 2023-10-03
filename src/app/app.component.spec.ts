import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MockBuilder } from 'ng-mocks';

describe('AppComponent', () => {
  beforeEach(() => MockBuilder(AppComponent));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render battle page', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const battlePage = fixture.nativeElement.querySelector('app-battle-page');
    expect(battlePage).toBeTruthy();
  });
});
