import * as _ from 'lodash'

function permutations<T>(array: T[]): T[][] {
  if (array.length === 1) return [array]
  return _.flatMap(array, (value, index) => {
    const remaining = [...array.slice(0, index), ...array.slice(index + 1)]
    return permutations(remaining).map((items: T[]) => [value, ...items])
  })
}

export default permutations
