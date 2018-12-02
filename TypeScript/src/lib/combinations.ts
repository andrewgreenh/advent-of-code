import * as _ from 'lodash';

import { toArray } from './ts-it/toArray';

function combinations<T, L extends number>(
  iterable: Iterable<T>,
  n: L,
  withReplacement = false,
): T[][] {
  const array = toArray(iterable);
  if (n === 1) return array.map(i => [i]);
  return _.flatMap(array, (item, index) => {
    const remaining = withReplacement ? array : array.slice(index + 1);
    return combinations(remaining, n - 1).map(items => [item, ...items]);
  });
}

_.mixin({
  combinations,
});

export default combinations;
