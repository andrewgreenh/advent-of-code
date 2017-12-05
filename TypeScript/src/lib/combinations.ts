import * as _ from 'lodash'

function combinations<T>(array: T[], n: number, withReplacement = false): T[][] {
  if (n === 1) return _.map(array, i => [i])
  return _.flatMap(array, (item, index) => {
    const remaining = withReplacement ? array : array.slice(index + 1)
    return combinations(remaining, n - 1).map(items => [item, ...items])
  })
}

_.mixin({
  combinations,
})

export default combinations
