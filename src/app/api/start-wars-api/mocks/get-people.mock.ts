import { UnwrapObservable } from '@/types/unwrap-observable.type';
import { of } from 'rxjs';
import { StarWarsApiService } from '../star-wars-api.service';

type GetPeopleResponse = UnwrapObservable<
  ReturnType<StarWarsApiService['getPeople']>
>;

export const createGetPeopleResponseEntry = (uid: string) =>
  ({
    uid: uid,
    name: `Person ${uid}`,
    url: `http://localhost:3000/api/people/${uid}/`,
  }) satisfies GetPeopleResponse['results'][number];

/**
 *  Creates a mock of the StarWarsApiService.getPeople() method. Handles basic pagination.
 *  @param records - The records from which pages will be created.
 *  @returns A mock of the StarWarsApiService.getPeople() method.
 */
export const createGetPeopleResponse =
  (records: GetPeopleResponse['results']): StarWarsApiService['getPeople'] =>
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
