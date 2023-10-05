import { screen } from '@testing-library/dom';
import { MockBuilder, MockRender } from 'ng-mocks';
import { MatCardModule } from '@angular/material/card';
import { StarshipOpponentCardComponent } from './starship-opponent-card.component';
import { StarshipDetails } from '../../models/starship-details.model';

describe(StarshipOpponentCardComponent.name, () => {
  beforeEach(() =>
    MockBuilder(StarshipOpponentCardComponent).keep(MatCardModule),
  );

  it('should create', () => {
    const fixture = MockRender(StarshipOpponentCardComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  const mockStarshipDetails = {
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

  it('should show opponent`s name', () => {
    MockRender(StarshipOpponentCardComponent, {
      opponent: mockStarshipDetails,
    });

    const opponentsNameEl = screen.findByText(mockStarshipDetails.name);

    expect(opponentsNameEl).toBeDefined();
  });

  describe('details', () => {
    const getRowByText = (text: string[]) =>
      screen.getByRole('row', {
        name: (accessibleName: string) =>
          text.every((text) => accessibleName.includes(text)),
      });

    const shouldShowDetail = (detailLabel: string, detailValue: string) =>
      it(`should show opponent's ${detailLabel.toLocaleLowerCase()}`, async () => {
        MockRender(StarshipOpponentCardComponent, {
          opponent: mockStarshipDetails,
        });

        const opponentNameEl = getRowByText([detailLabel, detailValue]);

        expect(opponentNameEl).toBeDefined();
      });

    /* detail tests */

    shouldShowDetail('Model', mockStarshipDetails.model);

    shouldShowDetail('Class', mockStarshipDetails.starship_class);

    shouldShowDetail('Cost', mockStarshipDetails.cost_in_credits);

    shouldShowDetail('Length', mockStarshipDetails.length);

    shouldShowDetail('Crew', mockStarshipDetails.crew);

    shouldShowDetail('Passengers', mockStarshipDetails.passengers);

    shouldShowDetail(
      'Max atmosphering speed',
      mockStarshipDetails.max_atmosphering_speed,
    );

    shouldShowDetail(
      'Hyperdrive rating',
      mockStarshipDetails.hyperdrive_rating,
    );

    shouldShowDetail('MGLT', mockStarshipDetails.MGLT);

    shouldShowDetail('Cargo capacity', mockStarshipDetails.cargo_capacity);

    shouldShowDetail('Consumables', mockStarshipDetails.consumables);
  });
});
