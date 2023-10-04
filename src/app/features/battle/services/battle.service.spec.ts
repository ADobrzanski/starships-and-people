import { MockBuilder, MockInstance } from 'ng-mocks';
import { BattleService } from './battle.service';
import { StartWarsApiService } from '@/api/start-wars-api/star-wars-api.service';
import { AppComponent } from '@/app.component';
import { map, of, skip, take, toArray } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { range } from '@/utils/range';
import {
  createGetPeopleResponseEntry,
  createGetPeopleResponse,
} from '@/api/start-wars-api/mocks/get-people.mock';
import { PersonDetails } from '../models/person-details.model';
import { BattleOutcome } from '../types/battle-status.enum';

const heavierOpponent = {
  birth_year: '19 BBY',
  eye_color: 'Blue',
  gender: 'Male',
  hair_color: 'Blond',
  height: '172',
  mass: '77',
  name: 'Luke Skywalker',
  skin_color: 'Fair',
} satisfies PersonDetails;

const lighterOpponent = {
  birth_year: '21 BBY',
  eye_color: 'Blue',
  gender: 'Male',
  hair_color: 'Blond',
  height: '152',
  mass: '50',
  name: 'Luke Skywalker Light',
  skin_color: 'Fair',
} satisfies PersonDetails;

describe(BattleService.name, () => {
  beforeEach(() =>
    MockBuilder(BattleService, AppComponent).mock(StartWarsApiService, {
      getPeople: () => of(),
    }),
  );

  it('should instantiate', () => {
    const service = TestBed.inject(BattleService);
    expect(service).toBeDefined();
  });

  describe('getAllPeople', () => {
    it('should return all characters', () => {
      // range numbers picked randomly, but not multiples of 10
      const peopleCollectionMock = range(15, 193).map((uid) =>
        createGetPeopleResponseEntry(uid.toString()),
      );

      MockInstance(
        StartWarsApiService,
        'getPeople',
        createGetPeopleResponse(peopleCollectionMock),
      );

      const service = TestBed.inject(BattleService);

      service['allCharacters'].subscribe((people) => {
        expect(people).toEqual(peopleCollectionMock);
      });
    });
  });

  describe('fieldOpponents', () => {
    it('should field provided opponents', () => {
      const service = TestBed.inject(BattleService);

      service.battle.pipe(skip(1)).subscribe((battle) => {
        expect(battle.firstOpponent).toEqual(heavierOpponent);
        expect(battle.secondOpponent).toEqual(lighterOpponent);
      });

      service.fieldOpponents(heavierOpponent, lighterOpponent);
    });
  });

  describe('initBattle', () => {
    it('should fetch and field new opponents', () => {
      const peopleCollectionMock = range(1, 1).map((uid) =>
        createGetPeopleResponseEntry(uid.toString()),
      );

      MockInstance(
        StartWarsApiService,
        'getPeople',
        createGetPeopleResponse(peopleCollectionMock),
      );

      MockInstance(StartWarsApiService, 'getPerson', () =>
        of({
          message: 'ok',
          result: {
            properties: {
              height: '170',
              mass: '40',
              hair_color: 'blond',
              skin_color: 'fair',
              eye_color: 'blue',
              birth_year: '19 BBY',
              gender: 'male',
              created: '2014-12-09T13:50:51.644000Z',
              edited: '2014-12-20T21:17:56.891000Z',
              name: 'Luke Skywalker',
              homeworld: 'http://swapi.dev/api/planets/1/',
              url: 'http://swapi.dev/api/people/1/',
            },
            description: 'A person within the Star Wars universe.',
            uid: '1',
          },
        }),
      );

      const service = TestBed.inject(BattleService);

      const fieldOpponentsSpy = spyOn(service, 'fieldOpponents');

      service.initBattle();

      expect(fieldOpponentsSpy).toHaveBeenCalled();
    });
  });

  describe('battle', () => {
    it('should return no opponents when no opponents fielded', () => {
      const service = TestBed.inject(BattleService);

      service.battle.pipe(take(1)).subscribe((battle) => {
        expect(battle.firstOpponent).toBeUndefined();
        expect(battle.secondOpponent).toBeUndefined();
      });
    });

    it('should have no winner when no opponents fielded', () => {
      const service = TestBed.inject(BattleService);

      service.battle.pipe(take(1)).subscribe((battle) => {
        expect(battle.winner).toBeUndefined();
      });
    });

    it('should declare heavier opponent winner', () => {
      const service = TestBed.inject(BattleService);

      service.fieldOpponents(heavierOpponent, lighterOpponent);

      service.battle.pipe(take(1)).subscribe((battle) => {
        expect(battle.winner).toEqual(heavierOpponent);
      });
    });

    it('should have UNDECIDABLE outcome when no opponents fielded', () => {
      const service = TestBed.inject(BattleService);

      service.battle.pipe(take(1)).subscribe((battle) => {
        expect(battle.outcome).toEqual(BattleOutcome.UNDECIDABLE);
      });
    });

    it('should have UNDECIDABLE outcome when one of the opponents weight is unknown', () => {
      const service = TestBed.inject(BattleService);

      service.fieldOpponents(
        {
          ...heavierOpponent,
          mass: 'unknown',
        },
        lighterOpponent,
      );

      service.battle.pipe(take(1)).subscribe((battle) => {
        expect(battle.outcome).toEqual(BattleOutcome.UNDECIDABLE);
      });
    });

    it('should have WINNER_FOUND outcome when one of the opponents is heavier', () => {
      const service = TestBed.inject(BattleService);

      service.fieldOpponents(heavierOpponent, lighterOpponent);

      service.battle.pipe(take(1)).subscribe((battle) => {
        expect(battle.outcome).toEqual(BattleOutcome.WINNER_FOUND);
      });
    });

    it('should have DRAW outcome when both opponents weight the same', () => {
      const service = TestBed.inject(BattleService);

      service.fieldOpponents(lighterOpponent, lighterOpponent);

      service.battle.pipe(take(1)).subscribe((battle) => {
        expect(battle.outcome).toEqual(BattleOutcome.DRAW);
      });
    });

    it('should increment first player`s score when first opponent wins', () => {
      const service = TestBed.inject(BattleService);

      service.battle
        .pipe(
          take(2),
          map((_) => _.score.firstPlayer),
          toArray(),
        )
        .subscribe((scoresPerBattle) => {
          expect(scoresPerBattle).toEqual([0, 1]);
        });

      service.fieldOpponents(heavierOpponent, lighterOpponent);
    });

    it('should not change second player`s score when first opponent wins', () => {
      const service = TestBed.inject(BattleService);

      service.battle
        .pipe(
          take(2),
          map((_) => _.score.secondPlayer),
          toArray(),
        )
        .subscribe((scoresPerBattle) => {
          expect(scoresPerBattle).toEqual([0, 0]);
        });

      service.fieldOpponents(heavierOpponent, lighterOpponent);
    });

    it('should increment second player`s score when second opponent wins', () => {
      const service = TestBed.inject(BattleService);

      service.battle
        .pipe(
          take(2),
          map((_) => _.score.secondPlayer),
          toArray(),
        )
        .subscribe((scoresPerBattle) => {
          expect(scoresPerBattle).toEqual([0, 1]);
        });

      service.fieldOpponents(lighterOpponent, heavierOpponent);
    });

    it('should not change first player`s score when second opponent wins', () => {
      const service = TestBed.inject(BattleService);

      service.battle
        .pipe(
          take(2),
          map((_) => _.score.firstPlayer),
          toArray(),
        )
        .subscribe((scoresPerBattle) => {
          expect(scoresPerBattle).toEqual([0, 0]);
        });

      service.fieldOpponents(lighterOpponent, heavierOpponent);
    });
  });
});
