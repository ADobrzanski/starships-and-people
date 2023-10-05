export class BattlePage {
  static visit = () => cy.visit('localhost:4200');

  static getFirstPlayerScore = () => cy.findByTestId('score-first-player');

  static getSecondPlayerScore = () => cy.findByTestId('score-second-player');

  static getBattleButton = () => cy.findByTestId('button-start-battle');

  static selectResourceTypeByName = (resourceName: string) => {
    // click on the select
    cy.findByRole('combobox', { name: /Who's fighting\?/ }).click();

    // pick the resource type
    cy.findByRole('listbox', { name: /Who's fighting\?/ })
      .findByRole('option', { name: resourceName })
      .click();
  };

  static getOpponents = () => cy.findAllByTestId('opponent-details');
}
