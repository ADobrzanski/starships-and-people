import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { PeopleBattleService } from './services/people-battle.service';
import { ResourceType } from './types/resource-type.enum';
import { FormsModule } from '@angular/forms';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { BattleOutcome } from './types/battle-status.enum';
import { Battle } from './models/battle.model';
import { exhaustiveSwitchGuard } from '@/utils/exhaustive-switch-guard';
import { StarshipBattleService } from './services/starship-battle.service';
import { PersonOpponentCardComponent } from './components/person-opponent-card/person-opponent-card.component';
import { StarshipOpponentCardComponent } from './components/starship-opponent-card/starship-opponent-card.component';
import { isPersonDetails } from './models/person-details.model';
import { isStarshipDetails } from './models/starship-details.model';

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
    PersonOpponentCardComponent,
    StarshipOpponentCardComponent,
  ],
  templateUrl: './battle-page.component.html',
  styleUrls: ['./battle-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BattlePageComponent {
  readonly ResourceType = ResourceType;

  readonly peopleBattleService = inject(PeopleBattleService);

  readonly starshipBattleService = inject(StarshipBattleService);

  readonly cdr = inject(ChangeDetectorRef);

  resourceType = ResourceType.PEOPLE;

  battle: Battle = {
    opponents: undefined,
    outcome: BattleOutcome.UNDECIDABLE,
  };

  score = [0, 0];

  private sub = new Subscription();

  initBattle() {
    this.sub.unsubscribe();

    let battle: Observable<Battle> = EMPTY;

    switch (this.resourceType) {
      case ResourceType.PEOPLE:
        battle = this.peopleBattleService.initBattle();
        break;
      case ResourceType.STARSHIPS:
        battle = this.starshipBattleService.initBattle();
        break;
      default:
        exhaustiveSwitchGuard(this.resourceType);
    }

    this.sub = battle.subscribe((battle) => {
      if (!battle.opponents) return;

      this.battle = battle;

      const winnerIndex = battle.opponents.findIndex(
        (opponent) => battle.winner === opponent,
      );

      if (winnerIndex !== -1) this.score[winnerIndex]++;

      this.cdr.detectChanges();
    });
  }

  isPersonDetails = isPersonDetails;
  isStarshipDetails = isStarshipDetails;
}
