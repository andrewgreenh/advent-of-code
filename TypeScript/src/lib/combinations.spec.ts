import combinations from './combinations';

const array = [1, 2, 3, 4, 5]

describe('combinations', () => {
  it('should return an array with an array for each item when n = 1', () => {
    const expected = [[1], [2], [3], [4], [5]]

    const actual = combinations(array, 1)

    expect(actual).toEqual(expected)
  })

  it('should return correct equal array if n equals array length', () => {
    const expected = [[1, 2, 3, 4, 5]]

    const actual = combinations(array, array.length)

    expect(actual).toEqual(expected)
  })

  it('should return correct pairs', () => {
    const expected = [
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
      [2, 3],
      [2, 4],
      [2, 5],
      [3, 4],
      [3, 5],
      [4, 5],
    ]
    const actual = combinations(array, 2)

    expect(actual).toEqual(expected)
  })

  it('should return all options, when replacement is activated', () => {
    const array = [1, 2]
    const expected = [[1, 1], [1, 2], [2, 1], [2, 2]]
    const actual = combinations(array, 2, true)
    expect(actual).toEqual(expected)
  })
})
