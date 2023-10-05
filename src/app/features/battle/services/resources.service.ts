import { StarWarsApiHelper } from '@/api/start-wars-api/helpers/star-wars-api.helper';
import { StarWarsApiService } from '@/api/start-wars-api/star-wars-api.service';
import { randomIn } from '@/utils/random-in';
import { inject, Injectable } from '@angular/core';
import { map, shareReplay, concatMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResourcesService {
  readonly starWarsApi = inject(StarWarsApiService);

  readonly allCharacters = StarWarsApiHelper.getAll(
    this.starWarsApi.getPeople.bind(this.starWarsApi),
  ).pipe(
    map((_) => _.results),
    shareReplay(1),
  );

  getAllPeople() {
    return this.allCharacters;
  }

  getRandomPersonDetails() {
    return this.getAllPeople().pipe(
      concatMap((characters) => {
        const randomIndex = randomIn(0, characters.length - 1);
        return this.starWarsApi.getPerson(characters[randomIndex].uid);
      }),
      map((response) => response.result.properties),
    );
  }

  readonly allStarships = StarWarsApiHelper.getAll(
    this.starWarsApi.getStarships.bind(this.starWarsApi),
  ).pipe(
    map((_) => _.results),
    shareReplay(1),
  );

  getAllStarships() {
    return this.allStarships;
  }

  getRandomStarshipDetails() {
    return this.getAllStarships().pipe(
      concatMap((starships) => {
        const randomIndex = randomIn(0, starships.length - 1);
        return this.starWarsApi.getStarship(starships[randomIndex].uid);
      }),
      map((response) => response.result.properties),
    );
  }
}
