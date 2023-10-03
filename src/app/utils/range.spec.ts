import { range } from './range';

describe('range', () => {
  it('should return a sequence of numbers from <start> to <end> when <start> < <end>', () => {
    expect(range(-1, 3)).toEqual([-1, 0, 1, 2, 3]);
  });

  it('should return a sequence of numbers from <start> to <end> when <start> > <end>', () => {
    expect(range(3, 0)).toEqual([3, 2, 1, 0]);
  });

  it('should return [<start>] when <start> === <start>', () => {
    expect(range(5, 5)).toEqual([5]);
  });
});
