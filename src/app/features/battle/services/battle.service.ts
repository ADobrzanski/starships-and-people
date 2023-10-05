import { Injectable, inject } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { PersonDetails } from '../models/person-details.model';
import { BattleOutcome } from '../types/battle-status.enum';
import { ResourcesService } from './resources.service';

@Injectable({ providedIn: 'root' })
export class BattleService {
  readonly resourcesService = inject(ResourcesService);

  decideOutcome(opponents: [PersonDetails, PersonDetails]): {
    outcome: BattleOutcome;
    winner?: PersonDetails;
  } {
    const [firstOpponent, secondOpponent] = opponents;

    if (!firstOpponent || !secondOpponent)
      return { outcome: BattleOutcome.UNDECIDABLE };

    const firstOpponentScore = Number(firstOpponent.mass);
    const secondOpponentScore = Number(secondOpponent.mass);

    if (isNaN(firstOpponentScore) || isNaN(secondOpponentScore))
      return { outcome: BattleOutcome.UNDECIDABLE };

    if (firstOpponentScore > secondOpponentScore) {
      return { outcome: BattleOutcome.WINNER_FOUND, winner: firstOpponent };
    } else if (firstOpponentScore < secondOpponentScore) {
      return { outcome: BattleOutcome.WINNER_FOUND, winner: secondOpponent };
    } else {
      return { outcome: BattleOutcome.DRAW };
    }
  }

  initBattle() {
    return forkJoin([
      this.resourcesService.getRandomPersonDetails(),
      this.resourcesService.getRandomPersonDetails(),
    ]).pipe(
      map((opponents) => {
        return {
          opponents: opponents as [
            Record<string, string>,
            Record<string, string>,
          ],
          ...this.decideOutcome(opponents),
        };
      }),
    );
  }
}
