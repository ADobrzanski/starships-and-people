import { StarshipDetails } from '../models/starship-details.model';

export const mockStarshipDetailsSmallCrew = {
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
  name: 'X-wing',
} satisfies StarshipDetails;

export const mockStarshipDetailsBigCrew = {
  model: 'Executor-class star dreadnought',
  starship_class: 'Star dreadnought',
  manufacturer: 'Kuat Drive Yards, Fondor Shipyards',
  cost_in_credits: '1143350000',
  length: '19000',
  crew: '279,144',
  passengers: '38000',
  max_atmosphering_speed: 'n/a',
  hyperdrive_rating: '2.0',
  MGLT: '40',
  cargo_capacity: '250000000',
  consumables: '6 years',
  name: 'Executor',
} satisfies StarshipDetails;
