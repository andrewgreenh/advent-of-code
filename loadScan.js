const _ = require('lodash');

function scan(array, fn, seed, thisArg) {
  var accumulator = seed;
  var results = [];
  if (seed === undefined) {
    accumulator = _.head(array);
    results.push(accumulator);
    array = _.tail(array);
  }
  results.push(accumulator);
  _.forEach(array, function (nextValue) {
    accumulator = fn.call(thisArg, accumulator, nextValue);
    results.push(accumulator);
  });
  return results;
};

_.mixin({
  scan: scan
});
