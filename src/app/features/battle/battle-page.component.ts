import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BattleService } from './services/battle.service';

@Component({
  selector: 'app-battle-page',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatCardModule],
  templateUrl: './battle-page.component.html',
  styleUrls: ['./battle-page.component.scss'],
})
export class BattlePageComponent {
  readonly battleService = inject(BattleService);

  battlefieldState$ = this.battleService.battlefieldState$;

  initBattle() {
    this.battleService.initBattle();
  }
}
