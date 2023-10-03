import { Component } from '@angular/core';
import { BattlePageComponent } from '@/features/battle/battle-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BattlePageComponent],
  template: ` <app-battle-page /> `,
})
export class AppComponent {}
