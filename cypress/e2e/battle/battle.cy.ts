import { interceptAndStubConsecutive } from '../../support/intercept-consecutive';
import { BattlePage } from './battle.page';
import { mockGetPersonResponseFromPartial } from './person-api.mock';
import { mockGetStarshipResponseFromPartial } from './starship-api.mock';

describe('battle page', () => {
  const timeoutCfg = { timeout: 20000 };

  beforeEach(() => {
    BattlePage.visit();
  });

  it('starts with 0 - 0 score', () => {
    BattlePage.getFirstPlayerScore().contains(0);
    BattlePage.getSecondPlayerScore().contains(0);
  });

  it('can trigger battle between people', () => {
    interceptAndStubConsecutive('GET', /.*\/people\/\d+/, [
      mockGetPersonResponseFromPartial({ name: 'Luke Skywalker', mass: '85' }),
      mockGetPersonResponseFromPartial({
        name: 'Benjamin Franklin',
        mass: '80',
      }),
    ]);

    BattlePage.selectResourceTypeByName('People');
    BattlePage.getBattleButton().click();
    BattlePage.getOpponents().should('have.length', 2);

    // Luke should wind due to mass
    const luke = cy.findByText(/Luke Skywalker/, timeoutCfg);
    luke.should('exist');
    luke.findByTestId('winner-badge').should('exist');

    cy.findByText(/Benjamin Franklin/, timeoutCfg).should('exist');
  });

  it('can trigger battle between starships', () => {
    interceptAndStubConsecutive('GET', /.*\/starships\/\d+/, [
      mockGetStarshipResponseFromPartial({ name: 'Death Star', crew: '342' }),
      mockGetStarshipResponseFromPartial({ name: 'X-Wing', crew: '1' }),
    ]);

    BattlePage.selectResourceTypeByName('Starships');
    BattlePage.getBattleButton().click();

    // Death star should win due to crew size
    const deathStar = cy.findByText(/Death Star/, timeoutCfg);
    deathStar.should('exist');
    deathStar.findByTestId('winner-badge').should('exist');

    cy.findByText(/X-Wing/, timeoutCfg).should('exist');
  });

  it('can trigger consecutive battles', () => {
    interceptAndStubConsecutive('GET', /.*\/people\/\d+/, [
      mockGetPersonResponseFromPartial({ name: 'Luke Skywalker' }),
      mockGetPersonResponseFromPartial({ name: 'Benjamin Franklin' }),
      mockGetPersonResponseFromPartial({ name: 'Rocky Balboa' }),
      mockGetPersonResponseFromPartial({ name: 'Adam Małysz' }),
    ]);

    BattlePage.getBattleButton().click();
    cy.findByText(/Luke Skywalker/, timeoutCfg).should('exist');
    cy.findByText(/Benjamin Franklin/, timeoutCfg).should('exist');

    BattlePage.getBattleButton().click();
    cy.findByText(/Rocky Balboa/, timeoutCfg).should('exist');
    cy.findByText(/Adam Małysz/, timeoutCfg).should('exist');
  });
});
