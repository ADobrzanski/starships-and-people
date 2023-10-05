import { screen } from '@testing-library/dom';
import { MockBuilder, MockRender } from 'ng-mocks';
import { MatCardModule } from '@angular/material/card';
import { StarshipOpponentCardComponent } from './starship-opponent-card.component';
import { mockStarshipDetailsBigCrew } from '../../mocks/starship-details.mocks';

describe(StarshipOpponentCardComponent.name, () => {
  beforeEach(() =>
    MockBuilder(StarshipOpponentCardComponent).keep(MatCardModule),
  );

  it('should create', () => {
    const fixture = MockRender(StarshipOpponentCardComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  const mockStarshipDetails = mockStarshipDetailsBigCrew;

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
