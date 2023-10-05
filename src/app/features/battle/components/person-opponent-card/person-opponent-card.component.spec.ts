import { screen } from '@testing-library/dom';
import { PersonOpponentCardComponent } from './person-opponent-card.component';
import { MockBuilder, MockRender } from 'ng-mocks';
import { MatCardModule } from '@angular/material/card';
import { PersonDetails } from '../../models/person-details.model';

describe('PersonOpponentCardComponent', () => {
  beforeEach(() =>
    MockBuilder(PersonOpponentCardComponent).keep(MatCardModule),
  );

  it('should create', () => {
    const fixture = MockRender(PersonOpponentCardComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  const mockPersonDetails = {
    birth_year: '19 BBY',
    eye_color: 'Blue',
    gender: 'Male',
    hair_color: 'Blond',
    height: '172',
    mass: '77',
    name: 'Luke Skywalker',
    skin_color: 'Fair',
  } satisfies PersonDetails;

  // const mockStarshipDetails = {
  //   model: 'T-65 X-wing',
  //   starship_class: 'Starfighter',
  //   manufacturer: 'Incom Corporation',
  //   cost_in_credits: '149999',
  //   length: '12.5',
  //   crew: '1',
  //   passengers: '0',
  //   max_atmosphering_speed: '1050',
  //   hyperdrive_rating: '1.0',
  //   MGLT: '100',
  //   cargo_capacity: '110',
  //   consumables: '1 week',
  //   name: 'X-wing',
  // } satisfies StarshipDetails;

  it('should show opponent`s name', () => {
    MockRender(PersonOpponentCardComponent, {
      opponent: mockPersonDetails,
    });

    const opponentsNameEl = screen.findByText(mockPersonDetails.name);

    expect(opponentsNameEl).toBeDefined();
  });

  describe('details', () => {
    const getRowByText = (text: string[]) =>
      screen.getByRole('row', {
        name: (accessibleName: string) =>
          text.every((text) => accessibleName.includes(text)),
      });

    const shouldShowDetail = (
      detailName: string,
      detailLabel: string,
      detailValue: string,
    ) =>
      it(`should show opponent's ${detailName}`, async () => {
        MockRender(PersonOpponentCardComponent, {
          opponent: mockPersonDetails,
        });

        const opponentNameEl = getRowByText([detailLabel, detailValue]);

        expect(opponentNameEl).toBeDefined();
      });

    /* detail tests */

    shouldShowDetail('birth year', 'Birth year', mockPersonDetails.birth_year);

    shouldShowDetail('eye color', 'Eye color', mockPersonDetails.eye_color);

    shouldShowDetail('gender', 'Gender', mockPersonDetails.gender);

    shouldShowDetail('hair color', 'Hair color', mockPersonDetails.hair_color);

    shouldShowDetail('height', 'Height', mockPersonDetails.height);

    shouldShowDetail('mass', 'Mass', mockPersonDetails.mass);

    shouldShowDetail('skin color', 'Skin color', mockPersonDetails.skin_color);
  });
});
