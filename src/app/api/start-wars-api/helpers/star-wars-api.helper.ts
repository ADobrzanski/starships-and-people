import { Observable, concatMap } from 'rxjs';

export class StarWarsApiHelper {
  static getAll<TResponse extends { total_records: number }>(
    getCollectionFn: (options: {
      pageSize: number;
      page: number;
    }) => Observable<TResponse>,
  ): Observable<TResponse> {
    return getCollectionFn({ pageSize: 1, page: 1 }).pipe(
      concatMap((response) =>
        getCollectionFn({ pageSize: response.total_records, page: 1 }),
      ),
    );
  }
}
