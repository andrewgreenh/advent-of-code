const _ = require('lodash');

function scan(array, fn, seed, thisArg) {
  let accumulator = seed;
  const results = [];
  if (seed === undefined) {
    accumulator = _.head(array);
    array = _.tail(array);
  }
  results.push(accumulator);
  _.forEach(array, nextValue => {
    accumulator = fn.call(thisArg, accumulator, nextValue);
    results.push(accumulator);
  });
  return results;
}

_.mixin({
  scan,
});
