const combine = require('../combine');
const input = require('../getInput')(2, 2017).trim();

const parse = x =>
  x
    .split('\n')
    .map(x => x.split('\t').map(x => +x))
    .map(row => row.sort((a, b) => a - b));

const result1 = parse(input)
  .map(r => r[r.length - 1] - r[0])
  .reduce((a, b) => a + b, 0);

const result2 = parse(input)
  .map(row => combine(row, 2).filter(([a, b]) => b % a === 0)[0])
  .map(([a, b]) => b / a)
  .reduce((a, b) => a + b, 0);

console.log(result1);
console.log(result2);
