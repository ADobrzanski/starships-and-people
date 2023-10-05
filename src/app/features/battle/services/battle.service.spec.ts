import { MockBuilder, MockInstance } from 'ng-mocks';
import { BattleService } from './battle.service';
import { StartWarsApiService } from '@/api/start-wars-api/star-wars-api.service';
import { AppComponent } from '@/app.component';
import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { PersonDetails } from '../models/person-details.model';
import { BattleOutcome } from '../types/battle-status.enum';
import { ResourcesService } from './resources.service';

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

const mockOpponentDetailsResponse = {
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
};

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

  describe('initBattle()', () => {
    it('should fetch and return two new opponents', () => {
      const getRandomPersonDetailsSpy = jasmine
        .createSpy()
        .and.returnValue(of(mockOpponentDetailsResponse));

      MockInstance(
        ResourcesService,
        'getRandomPersonDetails',
        getRandomPersonDetailsSpy,
      );

      const service = TestBed.inject(BattleService);

      service.initBattle().subscribe((battle) => {
        expect(getRandomPersonDetailsSpy).toHaveBeenCalledTimes(2);
        expect(battle.opponents).toEqual([
          mockOpponentDetailsResponse,
          mockOpponentDetailsResponse,
        ]);
      });
    });

    it('should decide on and return battle outcome', () => {
      MockInstance(ResourcesService, 'getRandomPersonDetails', () =>
        of(mockOpponentDetailsResponse),
      );

      const service = TestBed.inject(BattleService);

      const expectedOutcome = BattleOutcome.UNDECIDABLE;

      spyOn(service, 'decideOutcome').and.returnValue({
        outcome: expectedOutcome,
      });

      service.initBattle().subscribe((battle) => {
        expect(battle.outcome).toEqual(expectedOutcome);
      });
    });

    it('should decide on and return a winner', () => {
      MockInstance(ResourcesService, 'getRandomPersonDetails', () =>
        of(mockOpponentDetailsResponse),
      );

      const service = TestBed.inject(BattleService);

      const expectedWinner = heavierOpponent;

      spyOn(service, 'decideOutcome').and.returnValue({
        outcome: BattleOutcome.WINNER_FOUND,
        winner: expectedWinner,
      });

      service.initBattle().subscribe((battle) => {
        expect(battle.winner).toEqual(expectedWinner);
      });
    });
  });

  describe('decideOutcome()', () => {
    it('should return WINNER_FOUND outcome and declare heavier opponent winner', () => {
      const service = TestBed.inject(BattleService);

      expect(service.decideOutcome([heavierOpponent, lighterOpponent])).toEqual(
        {
          outcome: BattleOutcome.WINNER_FOUND,
          winner: heavierOpponent,
        },
      );
    });

    it('should return UNDECIDABLE outcome and no winner when one of the opponents weight is unknown', () => {
      const service = TestBed.inject(BattleService);

      const result = service.decideOutcome([
        { ...heavierOpponent, mass: 'unknown' },
        lighterOpponent,
      ]);

      expect(result).toEqual({ outcome: BattleOutcome.UNDECIDABLE });
    });

    it('should have DRAW outcome when both opponents weight the same', () => {
      const service = TestBed.inject(BattleService);

      expect(service.decideOutcome([lighterOpponent, lighterOpponent])).toEqual(
        { outcome: BattleOutcome.DRAW },
      );
    });
  });
});
