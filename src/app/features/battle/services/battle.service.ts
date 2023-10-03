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

  private readonly _battlefieldState$ = new BehaviorSubject<
    | {
        firstOpponent: undefined;
        secondOpponent: undefined;
      }
    | {
        firstOpponent: Record<string, unknown>;
        secondOpponent: Record<string, unknown>;
      }
  >({
    firstOpponent: undefined,
    secondOpponent: undefined,
  });

  readonly battlefieldState$ = this._battlefieldState$.asObservable();

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
        tap((data) => this._battlefieldState$.next(data)),
      )
      .subscribe();
  }
}
