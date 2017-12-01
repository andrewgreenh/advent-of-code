const _ = require('lodash');

module.exports = combine;

function combine(array, n) {
  if (n === 1) return _.map(array, i => [i]);
  return _.flatMap(array, (item, index, array) => {
    const remaining = array.slice(index + 1);
    return combine(remaining, n - 1).map(items => [item, ...items]);
  });
}

_.mixin({
  combine,
});
