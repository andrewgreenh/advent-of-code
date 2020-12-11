import { max, memoize, range, sortBy } from 'lodash';
import getInput from '../lib/getInput';
import { stringToLines } from '../lib/ts-it/lines';
import { p } from '../lib/ts-it/pipe';
import slide from '../lib/ts-it/slide';

const input = getInput(10, 2020);
const lines = stringToLines(input).map(Number);

let nums = sortBy(lines);
nums = [0, ...nums, max(nums)! + 3];
let ones = 0;
let threes = 0;
for (const [a, b] of p(nums)(slide(2)))
  b - a === 1 ? ones++ : b - a === 3 ? threes++ : 0;
console.log(ones * threes);

const count = memoize((t: number, x = 0): number => {
  if (t === 0) return 1;
  for (let s of range(t - 3, t)) if (nums[t] - nums[s] <= 3) x += count(s);
  return x;
});
console.log(count(nums.length - 1));
