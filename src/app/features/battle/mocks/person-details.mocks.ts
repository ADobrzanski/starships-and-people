import { PersonDetails } from '../models/person-details.model';

export const mockPersonDetailsHeavier = {
  birth_year: '19 BBY',
  eye_color: 'Brown',
  gender: 'Male',
  hair_color: 'Brown',
  height: '172',
  mass: '77',
  name: 'Obi-Wan Kenobi',
  skin_color: 'Fair',
} satisfies PersonDetails;

export const mockPersonDetailsLighter = {
  birth_year: '21 BBY',
  eye_color: 'Blue',
  gender: 'Male',
  hair_color: 'Blond',
  height: '152',
  mass: '50',
  name: 'Luke Skywalker',
  skin_color: 'Fair',
} satisfies PersonDetails;
