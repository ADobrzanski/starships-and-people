import { MockBuilder, MockInstance } from 'ng-mocks';
import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { BattleOutcome } from '../types/battle-status.enum';
import { ResourcesService } from './resources.service';
import { StarshipBattleService } from './starship-battle.service';
import { StarshipDetails } from '../models/starship-details.model';

const starshipWithMoreCrew = {
  model: 'T-65 X-wing',
  starship_class: 'Starfighter',
  manufacturer: 'Incom Corporation',
  cost_in_credits: '149999',
  length: '12.5',
  crew: '15',
  passengers: '0',
  max_atmosphering_speed: '1050',
  hyperdrive_rating: '1.0',
  MGLT: '100',
  cargo_capacity: '110',
  consumables: '1 week',
  name: 'X-wing',
} satisfies StarshipDetails;

const starshipWithLessCrew = {
  model: 'T-65 X-wing Smol',
  starship_class: 'Starfighter',
  manufacturer: 'Incom Corporation',
  cost_in_credits: '149999',
  length: '12.5',
  crew: '1',
  passengers: '0',
  max_atmosphering_speed: '1050',
  hyperdrive_rating: '1.0',
  MGLT: '100',
  cargo_capacity: '110',
  consumables: '1 week',
  name: 'X-wing',
} satisfies StarshipDetails;

const mockOpponentDetailsResponse = {
  model: 'T-65 X-wing',
  starship_class: 'Starfighter',
  manufacturer: 'Incom Corporation',
  cost_in_credits: '149999',
  length: '12.5',
  crew: '1',
  passengers: '0',
  max_atmosphering_speed: '1050',
  hyperdrive_rating: '1.0',
  MGLT: '100',
  cargo_capacity: '110',
  consumables: '1 week',
  pilots: [
    'https://www.swapi.tech/api/people/1',
    'https://www.swapi.tech/api/people/9',
    'https://www.swapi.tech/api/people/18',
    'https://www.swapi.tech/api/people/19',
  ],
  created: '2020-09-17T17:55:06.604Z',
  edited: '2020-09-17T17:55:06.604Z',
  name: 'X-wing',
  url: 'https://www.swapi.tech/api/starships/12',
};

describe(StarshipBattleService.name, () => {
  beforeEach(() =>
    MockBuilder(StarshipBattleService).mock(ResourcesService, {
      getRandomStarshipDetails: () => of(),
    }),
  );

  it('should instantiate', () => {
    const service = TestBed.inject(StarshipBattleService);
    expect(service).toBeDefined();
  });

  describe('initBattle()', () => {
    it('should fetch and return two new opponents', () => {
      const getRandomStarshipDetailsSpy = jasmine
        .createSpy()
        .and.returnValue(of(mockOpponentDetailsResponse));

      MockInstance(
        ResourcesService,
        'getRandomStarshipDetails',
        getRandomStarshipDetailsSpy,
      );

      const service = TestBed.inject(StarshipBattleService);

      service.initBattle().subscribe((battle) => {
        expect(getRandomStarshipDetailsSpy).toHaveBeenCalledTimes(2);
        expect(battle.opponents).toEqual([
          mockOpponentDetailsResponse,
          mockOpponentDetailsResponse,
        ]);
      });
    });

    it('should decide on and return battle outcome', () => {
      MockInstance(ResourcesService, 'getRandomStarshipDetails', () =>
        of(mockOpponentDetailsResponse),
      );

      const service = TestBed.inject(StarshipBattleService);

      const expectedOutcome = BattleOutcome.UNDECIDABLE;

      spyOn(service, 'decideOutcome').and.returnValue({
        outcome: expectedOutcome,
      });

      service.initBattle().subscribe((battle) => {
        expect(battle.outcome).toEqual(expectedOutcome);
      });
    });

    it('should decide on and return a winner', () => {
      MockInstance(ResourcesService, 'getRandomStarshipDetails', () =>
        of(mockOpponentDetailsResponse),
      );

      const service = TestBed.inject(StarshipBattleService);

      const expectedWinner = starshipWithMoreCrew;

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
    it('should return WINNER_FOUND outcome and declare a winner opponent with more crew', () => {
      const service = TestBed.inject(StarshipBattleService);

      expect(
        service.decideOutcome([starshipWithMoreCrew, starshipWithLessCrew]),
      ).toEqual({
        outcome: BattleOutcome.WINNER_FOUND,
        winner: starshipWithMoreCrew,
      });
    });

    it('should return UNDECIDABLE outcome and no winner when one of the opponents crew size is unknown', () => {
      const service = TestBed.inject(StarshipBattleService);

      const result = service.decideOutcome([
        { ...starshipWithMoreCrew, crew: 'unknown' },
        starshipWithLessCrew,
      ]);

      expect(result).toEqual({ outcome: BattleOutcome.UNDECIDABLE });
    });

    it('should have DRAW outcome when both opponents` crew size is the same', () => {
      const service = TestBed.inject(StarshipBattleService);

      expect(
        service.decideOutcome([starshipWithLessCrew, starshipWithLessCrew]),
      ).toEqual({ outcome: BattleOutcome.DRAW });
    });
  });
});
