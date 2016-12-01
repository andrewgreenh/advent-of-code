var _ = require('lodash');
var input = JSON.parse(require('../getInput')(12));

console.log(calculateCollection(input, false));
console.log(calculateCollection(input, true));

function calculateCollection(col, noReds) {
  if(noReds && _.isPlainObject(col) && _.includes(col, "red")) return 0;
  return _.reduce(col, (sum, item) => {
      if(_.isObject(item)) return sum+=calculateCollection(item, noReds);
      return _.isNumber(item) ? sum+item : sum;
  },0);
}
