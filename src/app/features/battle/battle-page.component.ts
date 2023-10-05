import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BattleService } from './services/battle.service';
import { ResourceType } from './types/resource-type.enum';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BattleOutcome } from './types/battle-status.enum';
import { Battle } from './models/battle.model';

@Component({
  selector: 'app-battle-page',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './battle-page.component.html',
  styleUrls: ['./battle-page.component.scss'],
})
export class BattlePageComponent {
  readonly ResourceType = ResourceType;

  readonly battleService = inject(BattleService);

  readonly cdr = inject(ChangeDetectorRef);

  resourceType = ResourceType.PEOPLE;

  battle: Battle = {
    opponents: undefined,
    outcome: BattleOutcome.UNDECIDABLE,
  };

  score = [0, 0];

  sub = new Subscription();

  initBattle() {
    this.sub.unsubscribe();
    this.sub = this.battleService.initBattle().subscribe((battle) => {
      this.battle = battle;

      const winnerIndex = battle.opponents.findIndex(
        (opponent) => battle.winner === opponent,
      );
      if (winnerIndex !== -1) this.score[winnerIndex]++;

      this.cdr.detectChanges();
    });
  }
}
