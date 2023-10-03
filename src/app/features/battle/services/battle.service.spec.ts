import { MockBuilder, MockInstance } from 'ng-mocks';
import { BattleService } from './battle.service';
import { StartWarsApiService } from '@/api/start-wars-api/star-wars-api.service';
import { AppComponent } from '@/app.component';
import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { range } from '@/utils/range';
import {
  createGetPeopleResponseEntry,
  createGetPeopleResponse,
} from '@/api/start-wars-api/mocks/get-people.mock';

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
});
