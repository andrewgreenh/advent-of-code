import slide from './slide';

describe('slide', () => {
  it('should create corret windows of size 1', () => {
    const array = [1, 2, 3, 4];
    const expected = [[1], [2], [3], [4]];

    const actual = slide(array, 1);

    expect(actual).toEqual(expected);
  });

  it('should create corret windows of size 2', () => {
    const array = [1, 2, 3, 4];
    const expected = [
      [1, 2],
      [2, 3],
      [3, 4],
    ];

    const actual = slide(array, 2);

    expect(actual).toEqual(expected);
  });
});
