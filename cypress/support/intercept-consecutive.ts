import { Method, RouteMatcher } from 'cypress/types/net-stubbing';

export const interceptAndStubConsecutive = (
  method: Method,
  routMatcher: RouteMatcher,
  stubSequence: unknown[],
) => {
  let requestCount = 0;
  cy.intercept(method, routMatcher, (req) => {
    if (requestCount < stubSequence.length)
      req.reply(stubSequence[requestCount++]);
  });
};
