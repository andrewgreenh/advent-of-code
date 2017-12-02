import combinations from '../lib/combinations';
import getInput from '../lib/getInput';

const input = getInput(2, 2017).trim();

const parse = (x: string) =>
  x
    .split('\n')
    .map(row => row.split('\t').map(Number))
    .map(row => row.sort((a, b) => a - b));

const result1 = parse(input)
  .map(row => row[row.length - 1] - row[0])
  .reduce((a, b) => a + b, 0);

const result2 = parse(input)
  .map(row => combinations(row, 2).filter(([a, b]) => b % a === 0)[0])
  .reduce((agg, [a, b]) => agg + b / a, 0);
console.log(result1);
console.log(result2);
