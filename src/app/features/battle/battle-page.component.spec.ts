import { MockBuilder, MockInstance, MockRender, ngMocks } from 'ng-mocks';

import { BattlePageComponent } from './battle-page.component';
import { BattleService } from './services/battle.service';
import { of } from 'rxjs';
import { PersonDetails } from './models/person-details.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { screen, getByText, getByRole } from '@testing-library/dom';

describe(BattlePageComponent.name, () => {
  MockInstance.scope();

  beforeEach(() =>
    MockBuilder(BattlePageComponent)
      .mock(BattleService, { export: true })
      .keep(MatCardModule)
      .keep(MatButtonModule),
  );

  it('should create', () => {
    expect(
      MockRender(BattlePageComponent).point.componentInstance,
    ).toBeTruthy();
  });

  describe('"Battle!" button', () => {
    it('should get rendered', () => {
      MockRender(BattlePageComponent);

      const battleButton = ngMocks.find(['data-testid', 'button-start-battle']);

      expect(battleButton).toBeTruthy();
    });

    it('should trigger initBattle() when clicked', () => {
      const tested = MockRender(BattlePageComponent);
      const initBattleSpy = spyOn(tested.point.componentInstance, 'initBattle');

      ngMocks.click(['data-testid', 'button-start-battle']);

      expect(initBattleSpy).toHaveBeenCalled();
    });
  });

  const opponentsTestCases = [
    { name: 'first opponent', idx: 0, storeKey: 'firstOpponent' },
    { name: 'second opponent', idx: 1, storeKey: 'secondOpponent' },
  ];

  opponentsTestCases.forEach((testCase) =>
    describe(testCase.name, () => {
      const emptyBattlefield = {
        firstOpponent: undefined,
        secondOpponent: undefined,
      };

      const nonEmptyBattlefield = {
        firstOpponent: { name: 'someOpponent' },
        secondOpponent: { name: 'someOtherOpponent' },
      };

      const opponentDetails = {
        birth_year: '19 BBY',
        eye_color: 'Blue',
        gender: 'Male',
        hair_color: 'Blond',
        height: '172',
        mass: '77',
        name: 'Luke Skywalker',
        skin_color: 'Fair',
      } satisfies PersonDetails;

      it('should get rendered when there are opponents on the battlefield', () => {
        const fixture = MockRender(BattlePageComponent);
        const instance = fixture.point.componentInstance;

        instance.battlefieldState$ = of({
          ...nonEmptyBattlefield,
          [testCase.storeKey]: opponentDetails,
        });
        fixture.detectChanges();

        expect(
          ngMocks.findAll(['data-testid', 'opponent-details'])[testCase.idx],
        ).toBeDefined();
      });

      it('should NOT get rendered when there are NO opponents on the battlefield', async () => {
        const fixture = MockRender(BattlePageComponent);
        const instance = fixture.point.componentInstance;

        instance.battlefieldState$ = of(emptyBattlefield);
        fixture.detectChanges();

        const opponentDetailsElList =
          await screen.queryAllByTestId('opponent-details');
        expect(opponentDetailsElList.length).toEqual(0);
      });

      it('should show opponent`s name', async () => {
        const fixture = MockRender(BattlePageComponent);
        const instance = fixture.point.componentInstance;

        instance.battlefieldState$ = of({
          ...nonEmptyBattlefield,
          [testCase.storeKey]: opponentDetails,
        });

        fixture.detectChanges();

        const opponentDetailsEl = (
          await screen.findAllByTestId('opponent-details')
        )[testCase.idx];

        const opponentNameEl = getByText(
          opponentDetailsEl,
          opponentDetails.name,
        );
        expect(opponentNameEl).toBeDefined();
      });

      const hasText = (text: string[]) => (accessibleName: string) =>
        text.every((text) => accessibleName.includes(text));

      const shouldShowDetail = (
        detailName: string,
        detailLabel: string,
        detailValue: string,
      ) =>
        it(`should show opponent's ${detailName}`, async () => {
          const fixture = MockRender(BattlePageComponent);
          const instance = fixture.point.componentInstance;

          instance.battlefieldState$ = of({
            ...nonEmptyBattlefield,
            [testCase.storeKey]: opponentDetails,
          });

          fixture.detectChanges();

          const opponentDetailsEl = (
            await screen.findAllByTestId('opponent-details')
          )[testCase.idx];

          const opponentNameEl = getByRole(opponentDetailsEl, 'row', {
            name: hasText([detailLabel, detailValue]),
          });
          expect(opponentNameEl).toBeDefined();
        });

      shouldShowDetail('birth year', 'Birth year', opponentDetails.birth_year);

      shouldShowDetail('eye color', 'Eye color', opponentDetails.eye_color);

      shouldShowDetail('hair color', 'Hair color', opponentDetails.hair_color);

      shouldShowDetail('height', 'Height', opponentDetails.height);

      shouldShowDetail('mass', 'Mass', opponentDetails.mass);

      shouldShowDetail('skin color', 'Skin color', opponentDetails.skin_color);
    }),
  );
});
