const _ = require('lodash');

module.exports = permute;

function permute(array) {
  if (array.length < 1) return [array];
  return _.flatMap(array, (item, index, array) => {
    const remaining = [...array.slice(0, index), ...array.slice(index + 1)];
    return permute(remaining).map(items => [item, ...items]);
  });
}

_.mixin({
  permute,
});
