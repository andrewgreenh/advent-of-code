import { max, min, minBy, range, sumBy } from 'lodash';
import getInput from '../lib/getInput';
import { abs } from '../lib/math/abs';
import { sumUntil } from '../lib/math/sumUntil';
import { numbers } from '../lib/ts-it/numbers';

const input = getInput(7, 2021);
const nums = numbers(input);

let minMove = -1;
let minCount = Infinity;

const sortedNums = range(min(nums)!, max(nums)! + 1);
const part1 = minBy(
  sortedNums.map((i) => ({ i, e: sumBy(nums, (n) => abs(n - i)) })),
  (x) => x.e,
);
const part2 = minBy(
  sortedNums.map((i) => ({ i, e: sumBy(nums, (n) => sumUntil(abs(n - i))) })),
  (x) => x.e,
);
console.log(part1, part2);
