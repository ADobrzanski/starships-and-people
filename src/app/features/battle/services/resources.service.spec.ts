import { MockBuilder, MockInstance } from 'ng-mocks';
import { ResourcesService } from './resources.service';
import { StarWarsApiService } from '@/api/start-wars-api/star-wars-api.service';
import {
  createGetPeopleResponse,
  createGetPeopleResponseEntry,
} from '@/api/start-wars-api/mocks/get-people.mock';
import { TestBed } from '@angular/core/testing';
import { range } from '@/utils/range';
import { EMPTY } from 'rxjs';

describe(ResourcesService.name, () => {
  beforeEach(() =>
    MockBuilder(ResourcesService).mock(StarWarsApiService, {
      getPeople: () => EMPTY,
      getStarships: () => EMPTY,
    }),
  );

  describe('getAllPeople', () => {
    it('should return all characters', () => {
      // range numbers picked randomly, but not multiples of 10
      const peopleCollectionMock = range(15, 193).map((uid) =>
        createGetPeopleResponseEntry(uid.toString()),
      );

      MockInstance(
        StarWarsApiService,
        'getPeople',
        createGetPeopleResponse(peopleCollectionMock),
      );

      const service = TestBed.inject(ResourcesService);

      service.getAllPeople().subscribe((people) => {
        expect(people).toEqual(peopleCollectionMock);
      });
    });
  });
});
