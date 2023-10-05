import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { STAR_WARS_API_BASE_URL } from '@/core/tokens/star-wars-api-base-url.token';
import {
  StarWarsPeopleApi,
  starWarsPeopleApiSchema,
} from './models/star-wars-people-api.model';
import {
  StarWarsPersonApi,
  starWarsPersonApiSchema,
} from './models/star-wars-person-api.model';
import { z } from 'zod';
import {
  StarWarsStarshipsApi,
  starWarsStarshipsApiSchema,
} from './models/star-wars-starships.api.model';
import {
  StarWarsStarshipApi,
  starWarsStarshipApiSchema,
} from './models/star-wars-starship-api.model';

const isIntegerGreaterThanZero = (value: number) =>
  z.number().int().gt(0).safeParse(value).success;

@Injectable({ providedIn: 'root' })
export class StarWarsApiService {
  constructor(
    @Inject(STAR_WARS_API_BASE_URL) private readonly baseApiUrl: string,
    private readonly http: HttpClient,
  ) {}

  /**
   *
   * @param options - Pagination details.
   * @param options.page - Page number, integer, greater than 0.
   * @param options.pageSize - Number of items per page, integer, greater than 0.
   * @returns Object with a list of people, total people count, page count, links to previous and next page.
   * @throws Will throw an error when options.page is less than 1 or options.pageSize is less than 1.
   */
  getPeople(options?: {
    page: number;
    pageSize: number;
  }): Observable<StarWarsPeopleApi> {
    if (options && !isIntegerGreaterThanZero(options.page))
      throw new Error(
        `"page" must be an integer greater than 0. ${options.page} was provided.`,
      );

    if (options && !isIntegerGreaterThanZero(options.pageSize))
      throw new Error(
        `"pageSize" must be and integer greater than 0. ${options.pageSize} was provided.`,
      );

    const url = new URL(`${this.baseApiUrl}/people/`);
    if (options) {
      url.searchParams.set('page', String(options.page));
      url.searchParams.set('limit', String(options.pageSize));
    }

    return this.http
      .get(url.toString())
      .pipe(map((response) => starWarsPeopleApiSchema.parse(response)));
  }

  /**
   * @param uid - Person uid.
   * @returns Person details.
   */
  getPerson(uid: string): Observable<StarWarsPersonApi> {
    return this.http
      .get(`${this.baseApiUrl}/people/${uid}/`)
      .pipe(map((response) => starWarsPersonApiSchema.parse(response)));
  }

  /**
   *
   * @param options - Pagination details.
   * @param options.page - Page number, integer, greater than 0.
   * @param options.pageSize - Number of items per page, integer, greater than 0.
   * @returns Object with a list of starships, total people count, page count, links to previous and next page.
   * @throws Will throw an error when options.page is less than 1 or options.pageSize is less than 1.
   */
  getStarships(options?: {
    page: number;
    pageSize: number;
  }): Observable<StarWarsStarshipsApi> {
    if (options && !isIntegerGreaterThanZero(options.page))
      throw new Error(
        `"page" must be an integer greater than 0. ${options.page} was provided.`,
      );

    if (options && !isIntegerGreaterThanZero(options.pageSize))
      throw new Error(
        `"pageSize" must be and integer greater than 0. ${options.pageSize} was provided.`,
      );

    const url = new URL(`${this.baseApiUrl}/starships/`);
    if (options) {
      url.searchParams.set('page', String(options.page));
      url.searchParams.set('limit', String(options.pageSize));
    }

    return this.http
      .get(url.toString())
      .pipe(map((response) => starWarsStarshipsApiSchema.parse(response)));
  }

  /**
   * @param uid - Starship uid.
   * @returns Starship details.
   */
  getStarship(uid: string): Observable<StarWarsStarshipApi> {
    return this.http
      .get(`${this.baseApiUrl}/starships/${uid}/`)
      .pipe(map((response) => starWarsStarshipApiSchema.parse(response)));
  }
}
