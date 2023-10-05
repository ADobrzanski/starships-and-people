export const mockGetPersonResponse = {
  message: 'ok',
  result: {
    properties: {
      height: '170',
      mass: '40',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
      birth_year: '19 BBY',
      gender: 'male',
      created: '2014-12-09T13:50:51.644000Z',
      edited: '2014-12-20T21:17:56.891000Z',
      name: 'Luke Skywalker',
      homeworld: 'http://swapi.dev/api/planets/1/',
      url: 'http://swapi.dev/api/people/1/',
    },
    description: 'A person from the Star Wars universe',
    uid: '1',
  },
};

export const mockGetPersonResponseFromPartial = (
  properties: Partial<(typeof mockGetPersonResponse)['result']['properties']>,
) => ({
  ...mockGetPersonResponse,
  result: {
    ...mockGetPersonResponse.result,
    properties: {
      ...mockGetPersonResponse.result.properties,
      ...properties,
    },
  },
});
