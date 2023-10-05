import { PersonDetails } from '../models/person-details.model';

export const heavierOpponent = {
  birth_year: '19 BBY',
  eye_color: 'Blue',
  gender: 'Male',
  hair_color: 'Blond',
  height: '172',
  mass: '77',
  name: 'Luke Skywalker',
  skin_color: 'Fair',
} satisfies PersonDetails;

export const lighterOpponent = {
  birth_year: '21 BBY',
  eye_color: 'Blue',
  gender: 'Male',
  hair_color: 'Blond',
  height: '152',
  mass: '50',
  name: 'Luke Skywalker Light',
  skin_color: 'Fair',
} satisfies PersonDetails;
