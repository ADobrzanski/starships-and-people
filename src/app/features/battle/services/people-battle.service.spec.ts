import { MockBuilder, MockInstance } from 'ng-mocks';
import { PeopleBattleService } from './people-battle.service';
import { AppComponent } from '@/app.component';
import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { BattleOutcome } from '../types/battle-status.enum';
import { ResourcesService } from './resources.service';
import {
  mockPersonDetailsHeavier,
  mockPersonDetailsLighter,
} from '../mocks/person-details.mocks';

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

describe(PeopleBattleService.name, () => {
  beforeEach(() =>
    MockBuilder(PeopleBattleService, AppComponent).mock(ResourcesService, {
      getRandomPersonDetails: () => of(),
    }),
  );

  it('should instantiate', () => {
    const service = TestBed.inject(PeopleBattleService);
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

      const service = TestBed.inject(PeopleBattleService);

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

      const service = TestBed.inject(PeopleBattleService);

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

      const service = TestBed.inject(PeopleBattleService);

      const expectedWinner = mockPersonDetailsHeavier;

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
      const service = TestBed.inject(PeopleBattleService);

      expect(
        service.decideOutcome([
          mockPersonDetailsHeavier,
          mockPersonDetailsLighter,
        ]),
      ).toEqual({
        outcome: BattleOutcome.WINNER_FOUND,
        winner: mockPersonDetailsHeavier,
      });
    });

    it('should return UNDECIDABLE outcome and no winner when one of the opponents weight is unknown', () => {
      const service = TestBed.inject(PeopleBattleService);

      const result = service.decideOutcome([
        { ...mockPersonDetailsHeavier, mass: 'unknown' },
        mockPersonDetailsLighter,
      ]);

      expect(result).toEqual({ outcome: BattleOutcome.UNDECIDABLE });
    });

    it('should have DRAW outcome when both opponents weight the same', () => {
      const service = TestBed.inject(PeopleBattleService);

      expect(
        service.decideOutcome([
          mockPersonDetailsLighter,
          mockPersonDetailsLighter,
        ]),
      ).toEqual({ outcome: BattleOutcome.DRAW });
    });
  });
});
