import { of } from 'rxjs';
import { StarWarsApiService } from '../star-wars-api.service';
import { StarWarsPeopleApi } from '../models/star-wars-people-api.model';
import { StarWarsPersonApi } from '../models/star-wars-person-api.model';
import { PersonDetails } from '@/features/battle/models/person-details.model';

/**
 *  Creates a mock of the StarWarsApiService.getPeople() method. Handles basic pagination.
 *  @param records - The records from which pages will be created.
 *  @returns A mock of the StarWarsApiService.getPeople() method.
 */
const createGetPeopleResponse =
  (records: StarWarsPeopleApi['results']): StarWarsApiService['getPeople'] =>
  (options) => {
    options ??= { page: 1, pageSize: 10 };
    const totalPages = Math.ceil(records.length / options.pageSize);
    const pageOffset = (options.page - 1) * options.pageSize;

    return of({
      message: 'ok',
      total_records: records.length,
      total_pages: totalPages,
      previous:
        options.page > 1
          ? `http://localhost:3000/api/people/?page=${options.page - 1}&limit=${
              options.pageSize
            }`
          : null,
      next:
        totalPages > options.page
          ? `http://localhost:3000/api/people/?page=${options.page + 1}&limit=${
              options.pageSize
            }`
          : null,
      results: records.slice(pageOffset, pageOffset + options.pageSize),
    });
  };

const createGetPeopleResponseEntry = (uid: string) =>
  ({
    uid: uid,
    name: `Person ${uid}`,
    url: `http://localhost:3000/api/people/${uid}/`,
  }) satisfies StarWarsPeopleApi['results'][number];

const mockGetPersonResponse = {
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
    description: 'A person from the Star Wars universe',
    uid: '1',
  },
} satisfies StarWarsPersonApi;

export class StarWarsApiServiceMocking {
  static getPeople = {
    response: {
      fromCollection: createGetPeopleResponse,
      resultEntry: createGetPeopleResponseEntry,
    },
  };

  static getPerson = {
    response: {
      mock: mockGetPersonResponse,
      fromDetailsPartial: (
        partial: Partial<PersonDetails>,
      ): StarWarsPersonApi => ({
        ...mockGetPersonResponse,
        result: {
          ...mockGetPersonResponse.result,
          properties: {
            ...mockGetPersonResponse.result.properties,
            ...partial,
          },
        },
      }),
    },
  };
}
