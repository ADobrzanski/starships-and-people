import { Injectable, inject } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { BattleOutcome } from '../types/battle-status.enum';
import { ResourcesService } from './resources.service';
import { StarshipDetails } from '../models/starship-details.model';

@Injectable({ providedIn: 'root' })
export class StarshipBattleService {
  readonly resourcesService = inject(ResourcesService);

  decideOutcome(opponents: [StarshipDetails, StarshipDetails]): {
    outcome: BattleOutcome;
    winner?: StarshipDetails;
  } {
    const [firstOpponent, secondOpponent] = opponents;

    if (!firstOpponent || !secondOpponent)
      return { outcome: BattleOutcome.UNDECIDABLE };

    const firstOpponentScore = Number(firstOpponent.crew);
    const secondOpponentScore = Number(secondOpponent.crew);

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
      this.resourcesService.getRandomStarshipDetails(),
      this.resourcesService.getRandomStarshipDetails(),
    ]).pipe(
      map((opponents) => {
        return {
          opponents: opponents as [StarshipDetails, StarshipDetails],
          ...this.decideOutcome(opponents),
        };
      }),
    );
  }
}
