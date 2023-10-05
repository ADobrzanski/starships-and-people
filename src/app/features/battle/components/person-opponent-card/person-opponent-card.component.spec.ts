import { screen } from '@testing-library/dom';
import { PersonOpponentCardComponent } from './person-opponent-card.component';
import { MockBuilder, MockRender } from 'ng-mocks';
import { MatCardModule } from '@angular/material/card';
import { mockPersonDetailsLighter } from '../../mocks/person-details.mocks';

describe('PersonOpponentCardComponent', () => {
  beforeEach(() =>
    MockBuilder(PersonOpponentCardComponent).keep(MatCardModule),
  );

  it('should create', () => {
    const fixture = MockRender(PersonOpponentCardComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  const mockPersonDetails = mockPersonDetailsLighter;

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
