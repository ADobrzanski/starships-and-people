import { MockBuilder, MockInstance, MockRender, ngMocks } from 'ng-mocks';

import { BattlePageComponent } from './battle-page.component';
import { BattleService } from './services/battle.service';
import { of } from 'rxjs';
import { PersonDetails } from './models/person-details.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  screen,
  getByText,
  getByRole,
  getByTestId,
  queryAllByTestId,
} from '@testing-library/dom';
import { BattleOutcome } from './types/battle-status.enum';

describe(BattlePageComponent.name, () => {
  MockInstance.scope();

  beforeEach(() =>
    MockBuilder(BattlePageComponent)
      .mock(BattleService, { export: true })
      .keep(MatCardModule)
      .keep(MatButtonModule)
      .keep(MatIconModule),
  );

  beforeEach(() =>
    MockInstance(
      BattleService,
      'battle',
      of({
        firstOpponent: undefined,
        secondOpponent: undefined,
        score: {
          firstPlayer: 0,
          secondPlayer: 0,
        },
        outcome: BattleOutcome.UNDECIDABLE,
      }),
    ),
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
      /* mock data */

      const mockOpponentDetails = {
        birth_year: '19 BBY',
        eye_color: 'Blue',
        gender: 'Male',
        hair_color: 'Blond',
        height: '172',
        mass: '77',
        name: 'Luke Skywalker',
        skin_color: 'Fair',
      } satisfies PersonDetails;

      const emptyBattlefield = {
        firstOpponent: undefined,
        secondOpponent: undefined,
        outcome: BattleOutcome.UNDECIDABLE,
        score: { firstPlayer: 0, secondPlayer: 0 },
      } as const;

      const nonEmptyBattlefield = {
        firstOpponent: mockOpponentDetails,
        secondOpponent: mockOpponentDetails,
        outcome: BattleOutcome.DRAW,
        score: { firstPlayer: 0, secondPlayer: 0 },
      } as const;

      /* tests */

      it('should get rendered when there are opponents on the battlefield', () => {
        const fixture = MockRender(BattlePageComponent);
        const instance = fixture.point.componentInstance;
        const opponentDetails = { ...mockOpponentDetails, name: 'Tested' };

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
        const opponentDetails = { ...mockOpponentDetails, name: 'Tested' };

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

      it('should get decorated when is a winner', async () => {
        const fixture = MockRender(BattlePageComponent);
        const instance = fixture.point.componentInstance;
        const opponentDetails = { ...mockOpponentDetails, name: 'Tested' };

        instance.battlefieldState$ = of({
          ...nonEmptyBattlefield,
          [testCase.storeKey]: opponentDetails,
          outcome: BattleOutcome.WINNER_FOUND,
          winner: opponentDetails,
        });

        fixture.detectChanges();

        const opponentDetailsEl = (
          await screen.findAllByTestId('opponent-details')
        )[testCase.idx];

        const winnerBadge = getByTestId(opponentDetailsEl, 'winner-badge');
        expect(winnerBadge).toBeDefined();
      });

      it('should NOT get decorated when is not a winner', async () => {
        const fixture = MockRender(BattlePageComponent);
        const instance = fixture.point.componentInstance;
        const opponentDetails = { ...mockOpponentDetails, name: 'Tested' };

        instance.battlefieldState$ = of({
          ...nonEmptyBattlefield,
          [testCase.storeKey]: opponentDetails,
          outcome: BattleOutcome.WINNER_FOUND,
          winner: mockOpponentDetails,
        });

        fixture.detectChanges();

        const opponentDetailsEl = (
          await screen.findAllByTestId('opponent-details')
        )[testCase.idx];

        const winnerBadges = await queryAllByTestId(
          opponentDetailsEl,
          'winner-badge',
        );
        expect(winnerBadges.length).toEqual(0);
      });

      /* reusable detail test */

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
            [testCase.storeKey]: mockOpponentDetails,
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

      /* detail tests */

      shouldShowDetail(
        'birth year',
        'Birth year',
        mockOpponentDetails.birth_year,
      );

      shouldShowDetail('eye color', 'Eye color', mockOpponentDetails.eye_color);

      shouldShowDetail(
        'hair color',
        'Hair color',
        mockOpponentDetails.hair_color,
      );

      shouldShowDetail('height', 'Height', mockOpponentDetails.height);

      shouldShowDetail('mass', 'Mass', mockOpponentDetails.mass);

      shouldShowDetail(
        'skin color',
        'Skin color',
        mockOpponentDetails.skin_color,
      );
    }),
  );

  describe('scoreboard', () => {
    it('should present first player`s score', () => {
      const fixture = MockRender(BattlePageComponent);
      const instance = fixture.point.componentInstance;

      const score = { firstPlayer: 5, secondPlayer: 12 };

      instance.battlefieldState$ = of({
        firstOpponent: undefined,
        secondOpponent: undefined,
        outcome: BattleOutcome.UNDECIDABLE,
        score,
      });

      fixture.detectChanges();

      const firstPlayerScoreEl = screen.getByTestId('score-first-player');
      expect(firstPlayerScoreEl.textContent).toContain(
        score.firstPlayer.toString(),
      );
    });

    it('should present second player`s score', () => {
      const fixture = MockRender(BattlePageComponent);
      const instance = fixture.point.componentInstance;

      const score = { firstPlayer: 5, secondPlayer: 12 };

      instance.battlefieldState$ = of({
        firstOpponent: undefined,
        secondOpponent: undefined,
        outcome: BattleOutcome.UNDECIDABLE,
        score,
      });

      fixture.detectChanges();

      const secondPlayerScoreEl = screen.getByTestId('score-second-player');
      expect(secondPlayerScoreEl.textContent).toContain(
        score.secondPlayer.toString(),
      );
    });
  });
});
