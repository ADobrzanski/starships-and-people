import { Injectable, inject } from '@angular/core';
import { StartWarsApiService } from '@/api/start-wars-api/star-wars-api.service';
import {
  BehaviorSubject,
  concatMap,
  forkJoin,
  map,
  shareReplay,
  tap,
} from 'rxjs';
import { PersonDetails } from '../models/person-details.model';
import { BattleOutcome } from '../types/battle-status.enum';
import { exhaustiveSwitchGuard } from '@/utils/exhaustive-switch-guard';

@Injectable({ providedIn: 'root' })
export class BattleService {
  private readonly startWarsApi = inject(StartWarsApiService);

  private readonly allCharacters = this.startWarsApi
    .getPeople({ page: 1, pageSize: 1 })
    .pipe(
      concatMap((response) =>
        this.startWarsApi.getPeople({
          page: 1,
          pageSize: response.total_records,
        }),
      ),
      map((response) => response.results),
      shareReplay(1),
    );

  private readonly battlefield = new BehaviorSubject<
    | {
        firstOpponent: undefined;
        secondOpponent: undefined;
      }
    | {
        firstOpponent: PersonDetails;
        secondOpponent: PersonDetails;
      }
  >({
    firstOpponent: undefined,
    secondOpponent: undefined,
  });

  private readonly score = {
    firstPlayer: 0,
    secondPlayer: 0,
  };

  readonly battle = this.battlefield.asObservable().pipe(
    map((data) => ({ ...data, ...this.decideOutcome(data) })),
    map((data) => {
      switch (data.outcome) {
        case BattleOutcome.WINNER_FOUND: {
          if (data.winner === data.firstOpponent) {
            this.score.firstPlayer++;
          } else {
            this.score.secondPlayer++;
          }
          break;
        }
        case BattleOutcome.DRAW: {
          this.score.firstPlayer++;
          this.score.secondPlayer++;
          break;
        }
        case BattleOutcome.UNDECIDABLE: {
          /* SCORE DOES NOT CHANGE */
          break;
        }
        default: {
          exhaustiveSwitchGuard(data.outcome);
        }
      }
      return { ...data, score: this.score };
    }),
    shareReplay(1),
  );

  private decideOutcome(battlefield: {
    firstOpponent?: PersonDetails;
    secondOpponent?: PersonDetails;
  }): { outcome: BattleOutcome; winner?: PersonDetails } {
    const { firstOpponent, secondOpponent } = battlefield;

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

  fieldOpponents(firstOpponent: PersonDetails, secondOpponent: PersonDetails) {
    this.battlefield.next({ firstOpponent, secondOpponent });
  }

  initBattle() {
    this.allCharacters
      .pipe(
        concatMap((characters) => {
          const getRandomCharacterIndex = () =>
            Math.trunc(Math.random() * characters.length);

          const getRandomCharacterDetails = () =>
            this.startWarsApi
              .getPerson(characters[getRandomCharacterIndex()].uid)
              .pipe(map((_) => _.result.properties));

          return forkJoin({
            firstOpponent: getRandomCharacterDetails(),
            secondOpponent: getRandomCharacterDetails(),
          });
        }),
        tap((data) =>
          this.fieldOpponents(data.firstOpponent, data.secondOpponent),
        ),
      )
      .subscribe();
  }
}
