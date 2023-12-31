export const mockGetStarshipResponse = {
  message: 'ok',
  result: {
    properties: {
      model: 'Executor-class star dreadnought',
      starship_class: 'Star dreadnought',
      manufacturer: 'Kuat Drive Yards, Fondor Shipyards',
      cost_in_credits: '1143350000',
      length: '19000',
      crew: '279,144',
      passengers: '38000',
      max_atmosphering_speed: 'n/a',
      hyperdrive_rating: '2.0',
      MGLT: '40',
      cargo_capacity: '250000000',
      consumables: '6 years',
      pilots: [],
      created: '2020-09-17T17:55:06.604Z',
      edited: '2020-09-17T17:55:06.604Z',
      name: 'Executor',
      url: 'https://www.swapi.tech/api/starships/15',
    },
    description: 'A Starship',
    uid: '15',
  },
};

export const mockGetStarshipResponseFromPartial = (
  properties: Partial<(typeof mockGetStarshipResponse)['result']['properties']>,
) => ({
  ...mockGetStarshipResponse,
  result: {
    ...mockGetStarshipResponse.result,
    properties: {
      ...mockGetStarshipResponse.result.properties,
      ...properties,
    },
  },
});
