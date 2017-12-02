const _ = require('lodash');
const combine = require('../combine');
const input = require('../getInput')(2, 2017);

const parse = x =>
  x
    .trim()
    .split('\n')
    .map(x => x.split('\t').map(x => +x));

const result1 = _(input)
  .thru(parse)
  .map(row => _.max(row) - _.min(row))
  .sum();

const result2 = _(input)
  .thru(parse)
  .flatMap(row => combine(row, 2).filter(([a, b]) => a % b === 0 || b % a === 0))
  .map(pairs => _.max(pairs) / _.min(pairs))
  .sum();

console.log(result1);
console.log(result2);
