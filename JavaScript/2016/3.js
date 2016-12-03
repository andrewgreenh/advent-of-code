const _ = require('lodash');
const lines = _.compact(require('../getInput')(3, 2016).split('\n'));
const permute = require('../permutate');

const data = lines.map(line => _.compact(line.split(/\s+/)).map(i => parseInt(i, 10)));
const data2 = _.flatMap(_.range(data.length / 3), i => _.times(3, j => _.times(3, k =>
  data[(i * 3) + k][j]
)));
const isPossibleTriangle = lengths => _.every(permute(lengths), o => (o[0] + o[1] > o[2]));
console.log(_.filter(data, isPossibleTriangle).length, _.filter(data2, isPossibleTriangle).length);
