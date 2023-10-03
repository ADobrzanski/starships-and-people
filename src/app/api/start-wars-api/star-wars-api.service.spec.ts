import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StartWarsApiService } from './star-wars-api.service';
import { StarWarsPeopleApi } from './models/star-wars-people-api.model';
import { StarWarsPersonApi } from './models/star-wars-person-api.model';
import { STAR_WARS_API_BASE_URL } from '@/core/tokens/star-wars-api-base-url.token';

describe(StartWarsApiService.name, () => {
  const baseApiUrl = 'http://testbaseapiurl.com';

  let service: StartWarsApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: STAR_WARS_API_BASE_URL, useValue: baseApiUrl }],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(StartWarsApiService);
  });

  describe('getPeople', () => {
    it('should call <STAR_WARS_API_BASE_URL>/people/ when no argument provided', () => {
      service.getPeople().subscribe();

      const request = httpTestingController.expectOne({
        url: `${baseApiUrl}/people/`,
        method: 'GET',
      });

      httpTestingController.verify();

      expect(request).toBeDefined();
    });

    describe('pagination', () => {
      const validPaginationOptions = {
        page: 1,
        pageSize: 10,
      };

      it('should fetch desired page when "page" is greater than 0', () => {
        const paginationOptions = {
          ...validPaginationOptions,
          page: 2,
        };

        const expectedUrl = new URL(`${baseApiUrl}/people/`);
        expectedUrl.searchParams.set('page', String(paginationOptions.page));
        expectedUrl.searchParams.set(
          'limit',
          String(paginationOptions.pageSize),
        );

        service.getPeople(paginationOptions).subscribe();

        const request = httpTestingController.expectOne({
          url: expectedUrl.toString(),
          method: 'GET',
        });

        httpTestingController.verify();

        expect(request).toBeDefined();
      });

      it('should throw error when "page" is less than 1', () => {
        const paginationOptions = {
          ...validPaginationOptions,
          page: 0,
        };

        try {
          service.getPeople(paginationOptions).subscribe();
        } catch (error) {
          expect(error).toBeDefined();
        }
      });

      it('should fetch page of desired size when "pageSize" is greater than 0', () => {
        const paginationOptions = {
          ...validPaginationOptions,
          pageSize: 5,
        };

        const expectedUrl = new URL(`${baseApiUrl}/people/`);
        expectedUrl.searchParams.set('page', String(paginationOptions.page));
        expectedUrl.searchParams.set(
          'limit',
          String(paginationOptions.pageSize),
        );

        service.getPeople(paginationOptions).subscribe();

        const request = httpTestingController.expectOne({
          url: expectedUrl.toString(),
          method: 'GET',
        });

        httpTestingController.verify();

        expect(request).toBeDefined();
      });

      it('should throw error when "pageSize" is less than 1', () => {
        const paginationOptions = {
          ...validPaginationOptions,
          pageSize: 0,
        };

        try {
          service.getPeople(paginationOptions).subscribe();
        } catch (error) {
          expect(error).toBeDefined();
        }
      });
    });

    it('should return response with a list of people when response follows expected schema', () => {
      const mockPeopleResponse: StarWarsPeopleApi = {
        message: 'ok',
        total_records: 2,
        total_pages: 1,
        previous: null,
        next: null,
        results: [
          {
            uid: '1',
            name: 'Luke Skywalker',
            url: 'https://www.swapi.tech/api/people/1',
          },
          {
            uid: '2',
            name: 'C-3PO',
            url: 'https://www.swapi.tech/api/people/2',
          },
        ],
      };

      const resultHandlerSpy = jasmine.createSpy();

      service.getPeople().subscribe(resultHandlerSpy);

      const request = httpTestingController.expectOne({
        url: `${baseApiUrl}/people/`,
        method: 'GET',
      });

      request.flush(mockPeopleResponse);

      httpTestingController.verify();

      expect(resultHandlerSpy).toHaveBeenCalledWith(mockPeopleResponse);
    });

    it('should error when response does not satisfy expected schema', () => {
      // NOTE: smoke test - assumes zod implementation and defined schema are correct

      const mockPeopleMalformedResponse: StarWarsPeopleApi = {
        message: 'ok',
        total_records: 2,
        total_pages: 1,
        previous: null,
        next: null,
        // @ts-expect-error - error trigger; property `results` is expected to by an array
        results: 'not an array',
      };

      const errorHandlerSpy = jasmine.createSpy();

      service.getPeople().subscribe({ error: errorHandlerSpy });

      const request = httpTestingController.expectOne({
        url: `${baseApiUrl}/people/`,
        method: 'GET',
      });

      request.flush(mockPeopleMalformedResponse);

      httpTestingController.verify();

      expect(errorHandlerSpy).toHaveBeenCalled();
    });
  });

  describe('getPerson', () => {
    it('should call <STAR_WARS_API_BASE_URL>/people/<id>', () => {
      const personUid = '1';

      service.getPerson(personUid).subscribe();

      const request = httpTestingController.expectOne({
        url: `${baseApiUrl}/people/${personUid}/`,
        method: 'GET',
      });

      httpTestingController.verify();

      expect(request).toBeDefined();
    });

    it('should return response with person`s details when response follows expected schema', () => {
      const personUid = '1';

      const mockPersonResponse: StarWarsPersonApi = {
        message: 'ok',
        result: {
          properties: {
            height: '172',
            mass: '77',
            hair_color: 'blond',
            skin_color: 'fair',
            eye_color: 'blue',
            birth_year: '19BBY',
            gender: 'male',
            created: '2023-09-29T23:35:36.297Z',
            edited: '2023-09-29T23:35:36.297Z',
            name: 'Luke Skywalker',
            homeworld: `${baseApiUrl}/planets/1`,
            url: `${baseApiUrl}/people/1`,
          },
          description: 'A person within the Star Wars universe',
          uid: personUid,
        },
      };

      const resultHandlerSpy = jasmine.createSpy();

      service.getPerson(personUid).subscribe(resultHandlerSpy);

      const request = httpTestingController.expectOne({
        url: `${baseApiUrl}/people/${personUid}/`,
        method: 'GET',
      });

      request.flush(mockPersonResponse);

      httpTestingController.verify();

      expect(resultHandlerSpy).toHaveBeenCalledWith(mockPersonResponse);
    });

    it('should error when response does not satisfy expected schema', () => {
      // NOTE: smoke test - assumes zod implementation and defined schema are correct
      const personId = '1';

      const mockPersonMalformedResponse: StarWarsPersonApi = {
        message: 'ok',
        result: {
          properties: {
            // @ts-expect-error - error trigger; property `height` is expected to be a string
            height: false,
            mass: '77',
            hair_color: 'blond',
            skin_color: 'fair',
            eye_color: 'blue',
            birth_year: '19BBY',
            gender: 'male',
            created: '2023-09-29T23:35:36.297Z',
            edited: '2023-09-29T23:35:36.297Z',
            name: 'Luke Skywalker',
            homeworld: `${baseApiUrl}/planets/1`,
            url: `${baseApiUrl}/people/${personId}`,
          },
          description: 'A person within the Star Wars universe',
          uid: '1',
        },
      };

      const errorHandlerSpy = jasmine.createSpy();

      service.getPerson(personId).subscribe({ error: errorHandlerSpy });

      const request = httpTestingController.expectOne({
        url: `${baseApiUrl}/people/${personId}/`,
        method: 'GET',
      });

      request.flush(mockPersonMalformedResponse);

      httpTestingController.verify();

      expect(errorHandlerSpy).toHaveBeenCalled();
    });
  });
});
