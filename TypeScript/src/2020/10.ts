import { max, memoize, range, sortBy } from 'lodash';
import getInput from '../lib/getInput';
import { stringToLines } from '../lib/ts-it/lines';

const input = getInput(10, 2020);
const lines = stringToLines(input).map(Number);

const sorted = sortBy(lines);
const m = max(sorted)! + 3;
let last = 0;
sorted.push(m);
sorted.unshift(0);
let ones = 0;
let threes = 0;

for (const i of sorted) {
  let diff = i - last;
  if (diff === 1) ones++;
  if (diff === 3) threes++;
  last = i;
}

console.log(ones * threes);

const countWays = memoize(function (targetIndex: number): number {
  if (targetIndex === 0) return 1;

  let ways = 0;
  for (const start of range(targetIndex - 3, targetIndex)) {
    const diff = sorted[targetIndex] - sorted[start];
    if (diff > 3 || !diff) continue;
    ways += countWays(start);
  }
  return ways;
});

console.log(countWays(sorted.length - 1));
