const _ = require('lodash');
var input = require('../getInput')(10).trim();

const result = _.range(50).reduce(
  i => _(i.match(/(.)\1*/g)).map(d => d.length+d[0]).reduce((agg, s) => agg+s),
  input);

console.log(result.length);
