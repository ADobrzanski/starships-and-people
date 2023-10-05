import { MockBuilder, MockInstance, MockRender, ngMocks } from 'ng-mocks';

import { BattlePageComponent } from './battle-page.component';
import { PeopleBattleService } from './services/people-battle.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { screen } from '@testing-library/dom';
import { BattleOutcome } from './types/battle-status.enum';
import { Battle } from './models/battle.model';
import { StarshipBattleService } from './services/starship-battle.service';
import { PersonOpponentCardComponent } from './components/person-opponent-card/person-opponent-card.component';
import { StarshipOpponentCardComponent } from './components/starship-opponent-card/starship-opponent-card.component';
import {
  mockPersonDetailsHeavier,
  mockPersonDetailsLighter,
} from './mocks/person-details.mocks';
import { EMPTY, of } from 'rxjs';
import { ResourceType } from './types/resource-type.enum';
import {
  mockStarshipDetailsBigCrew,
  mockStarshipDetailsSmallCrew,
} from './mocks/starship-details.mocks';

describe(BattlePageComponent.name, () => {
  MockInstance.scope();

  beforeEach(() =>
    MockBuilder(BattlePageComponent)
      .mock(PeopleBattleService, { export: true })
      .mock(StarshipBattleService, { export: true })
      .keep(MatCardModule)
      .keep(MatButtonModule)
      .keep(MatIconModule)
      .keep(PersonOpponentCardComponent)
      .keep(StarshipOpponentCardComponent),
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

  describe('initBattle()', () => {
    it('should call PeopleBattleService.initBattle() when people are selected', () => {
      const initBattleSpy = jasmine.createSpy().and.returnValue(EMPTY);
      MockInstance(PeopleBattleService, 'initBattle', initBattleSpy);

      const fixture = MockRender(BattlePageComponent);
      const instance = fixture.point.componentInstance;

      instance.resourceType = ResourceType.PEOPLE;

      instance.initBattle();

      expect(initBattleSpy).toHaveBeenCalled();
    });

    it('should increment score of the winning side', () => {
      const mockBattle = {
        opponents: [mockPersonDetailsHeavier, mockPersonDetailsLighter],
        outcome: BattleOutcome.WINNER_FOUND,
        winner: mockPersonDetailsHeavier,
      } satisfies Battle;

      MockInstance(PeopleBattleService, 'initBattle', () => of(mockBattle));

      const fixture = MockRender(BattlePageComponent);
      const instance = fixture.point.componentInstance;

      instance.resourceType = ResourceType.PEOPLE;
      instance.initBattle();

      expect(instance.score[0]).toEqual(1);
      expect(instance.score[1]).toEqual(0);
    });

    it('should call StarshipBattleService.initBattle() when starships are selected', () => {
      const initBattleSpy = jasmine.createSpy().and.returnValue(EMPTY);
      MockInstance(StarshipBattleService, 'initBattle', initBattleSpy);

      const tested = MockRender(BattlePageComponent);
      tested.point.componentInstance.resourceType = ResourceType.STARSHIPS;

      tested.point.componentInstance.initBattle();

      expect(initBattleSpy).toHaveBeenCalled();
    });
  });

  describe('opponents', () => {
    it('should NOT get rendered when there are NO opponents on the battlefield', async () => {
      const fixture = MockRender(BattlePageComponent);
      const instance = fixture.point.componentInstance;

      const battle = {
        opponents: undefined,
        outcome: BattleOutcome.DRAW,
      } satisfies Battle;

      instance.battle = battle;

      instance.cdr.detectChanges();

      const opponentDetailsElList =
        await screen.queryAllByTestId('opponent-details');
      expect(opponentDetailsElList.length).toEqual(0);
    });

    it('should get rendered when there are opponents (people) on the battlefield', () => {
      const fixture = MockRender(BattlePageComponent);
      const instance = fixture.point.componentInstance;

      const battle = {
        opponents: [mockPersonDetailsLighter, mockPersonDetailsHeavier],
        outcome: BattleOutcome.DRAW,
      } satisfies Battle;

      instance.battle = battle;

      instance.cdr.detectChanges();

      const opponentCards = ngMocks.findAll(PersonOpponentCardComponent);
      expect(opponentCards.length).toEqual(2);
      expect(
        opponentCards[0].componentInstance.opponent === battle.opponents[0],
      );
      expect(
        opponentCards[1].componentInstance.opponent === battle.opponents[1],
      );
    });

    it('should get rendered when there are opponents (starships) on the battlefield', () => {
      const fixture = MockRender(BattlePageComponent);
      const instance = fixture.point.componentInstance;

      const battle = {
        opponents: [mockStarshipDetailsSmallCrew, mockStarshipDetailsBigCrew],
        outcome: BattleOutcome.DRAW,
      } satisfies Battle;

      instance.battle = battle;

      instance.cdr.detectChanges();

      const opponentCards = ngMocks.findAll(StarshipOpponentCardComponent);
      expect(opponentCards.length).toEqual(2);
      expect(
        opponentCards[0].componentInstance.opponent === battle.opponents[0],
      );
      expect(
        opponentCards[1].componentInstance.opponent === battle.opponents[1],
      );
    });

    it('should mark winner when there is one', async () => {
      const fixture = MockRender(BattlePageComponent);
      const instance = fixture.point.componentInstance;

      const battle = {
        opponents: [mockPersonDetailsLighter, mockPersonDetailsHeavier],
        outcome: BattleOutcome.WINNER_FOUND,
        winner: mockPersonDetailsHeavier,
      } satisfies Battle;

      instance.battle = battle;

      instance.cdr.detectChanges();

      const opponentCards = ngMocks.findAll(PersonOpponentCardComponent);
      expect(opponentCards[0].componentInstance.isWinner).toBeFalse();
      expect(opponentCards[1].componentInstance.isWinner).toBeTrue();
    });

    it('should NOT mark winner when there is none', async () => {
      const fixture = MockRender(BattlePageComponent);
      const instance = fixture.point.componentInstance;

      const battle = {
        opponents: [mockPersonDetailsLighter, mockPersonDetailsHeavier],
        outcome: BattleOutcome.DRAW,
      } satisfies Battle;

      instance.battle = battle;

      instance.cdr.detectChanges();

      const opponentCards = ngMocks.findAll(PersonOpponentCardComponent);
      expect(opponentCards[0].componentInstance.isWinner).toBeFalse();
      expect(opponentCards[1].componentInstance.isWinner).toBeFalse();
    });
  });

  describe('scoreboard', () => {
    it('should present first player`s score', () => {
      const fixture = MockRender(BattlePageComponent);
      const instance = fixture.point.componentInstance;

      const testedScore = 12;

      instance.score = [testedScore, 0];

      instance.cdr.detectChanges();

      const firstPlayerScoreEl = screen.getByTestId('score-first-player');
      expect(firstPlayerScoreEl.textContent).toContain(testedScore.toString());
    });

    it('should present second player`s score', () => {
      const fixture = MockRender(BattlePageComponent);
      const instance = fixture.point.componentInstance;

      const testedScore = 4;

      instance.score = [0, testedScore];

      instance.cdr.detectChanges();

      const secondPlayerScoreEl = screen.getByTestId('score-second-player');
      expect(secondPlayerScoreEl.textContent).toContain(testedScore.toString());
    });
  });
});
