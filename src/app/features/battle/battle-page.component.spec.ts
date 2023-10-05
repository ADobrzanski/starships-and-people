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
import { Battle } from './models/battle.model';

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
    MockInstance(BattleService, 'initBattle', () =>
      of({
        opponents: [{}, {}],
        outcome: BattleOutcome.UNDECIDABLE,
      } satisfies Battle),
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
    { name: 'first opponent', idx: 0 },
    { name: 'second opponent', idx: 1 },
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

      /* tests */

      it('should get rendered when there are opponents on the battlefield', () => {
        const fixture = MockRender(BattlePageComponent);
        const instance = fixture.point.componentInstance;

        const battle = {
          opponents: [mockOpponentDetails, mockOpponentDetails],
          outcome: BattleOutcome.DRAW,
        } satisfies Battle;

        battle.opponents[testCase.idx] = mockOpponentDetails;

        instance.battle = battle;

        fixture.detectChanges();

        expect(
          ngMocks.findAll(['data-testid', 'opponent-details'])[testCase.idx],
        ).toBeDefined();
      });

      it('should NOT get rendered when there are NO opponents on the battlefield', async () => {
        const fixture = MockRender(BattlePageComponent);
        const instance = fixture.point.componentInstance;

        const battle = {
          opponents: undefined,
          outcome: BattleOutcome.DRAW,
        } satisfies Battle;

        instance.battle = battle;

        fixture.detectChanges();

        const opponentDetailsElList =
          await screen.queryAllByTestId('opponent-details');
        expect(opponentDetailsElList.length).toEqual(0);
      });

      it('should show opponent`s name', async () => {
        const fixture = MockRender(BattlePageComponent);
        const instance = fixture.point.componentInstance;

        const opponentDetails = { ...mockOpponentDetails, name: 'Tested' };

        const battle = {
          opponents: [mockOpponentDetails, mockOpponentDetails],
          outcome: BattleOutcome.DRAW,
        } satisfies Battle;

        battle.opponents[testCase.idx] = opponentDetails;

        instance.battle = battle;

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

        const battle = {
          opponents: [mockOpponentDetails, mockOpponentDetails],
          outcome: BattleOutcome.WINNER_FOUND,
          winner: opponentDetails,
        } satisfies Battle;

        battle.opponents[testCase.idx] = opponentDetails;

        instance.battle = battle;

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

        const battle = {
          opponents: [mockOpponentDetails, mockOpponentDetails],
          outcome: BattleOutcome.WINNER_FOUND,
          winner: mockOpponentDetails,
        } satisfies Battle;

        battle.opponents[testCase.idx] = opponentDetails;

        instance.battle = battle;

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

          const battle = {
            opponents: [mockOpponentDetails, mockOpponentDetails],
            outcome: BattleOutcome.DRAW,
          } satisfies Battle;

          instance.battle = battle;

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

      const testedScore = 12;

      instance.score = [testedScore, 0];

      fixture.detectChanges();

      const firstPlayerScoreEl = screen.getByTestId('score-first-player');
      expect(firstPlayerScoreEl.textContent).toContain(testedScore.toString());
    });

    it('should present second player`s score', () => {
      const fixture = MockRender(BattlePageComponent);
      const instance = fixture.point.componentInstance;

      const testedScore = 4;

      instance.score = [0, testedScore];

      fixture.detectChanges();

      const secondPlayerScoreEl = screen.getByTestId('score-second-player');
      expect(secondPlayerScoreEl.textContent).toContain(testedScore.toString());
    });
  });
});
