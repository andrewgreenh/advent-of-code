import permutations from './permutations'

describe('permutations', () => {
  it('should return nested array when length is 1', () => {
    const array = [1]
    const expected = [[1]]

    const actual = permutations(array)

    expect(actual).toEqual(expected)
  })

  it('should return all permutations', () => {
    const array = [1, 2]
    const expected = [[1, 2], [2, 1]]

    const actual = permutations(array)

    expect(actual).toEqual(expected)
  })

  it('should return all permutations at length 3', () => {
    const array = [1, 2, 3]
    const expected = [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]

    const actual = permutations(array)

    expect(actual).toEqual(expected)
  })
})
