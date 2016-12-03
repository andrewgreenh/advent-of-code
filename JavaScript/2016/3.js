const _ = require('lodash');
const lines = _.compact(require('../getInput')(3, 2016).split('\n'));

const data = lines.map(line => _.compact(line.split(/\s+/)).map(i => parseInt(i, 10)));
const data2 = _.flatMap(_.range(data.length / 3), i => _.times(3, j => _.times(3, k =>
  data[(i * 3) + k][j]
)));
const isTriangle = ([a, b, c]) => a + b > c && a + c > b && c + b > a;
console.log(_.filter(data, isTriangle).length, _.filter(data2, isTriangle).length);
