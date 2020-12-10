import { max, memoize, range, sortBy } from 'lodash';
import getInput from '../lib/getInput';
import { stringToLines } from '../lib/ts-it/lines';

const input = getInput(10, 2020);
const lines = stringToLines(input).map(Number);

const nums = sortBy(lines);
const m = max(nums)! + 3;
let last = 0;
nums.push(m);
nums.unshift(0);
let ones = 0;
let threes = 0;

for (const i of nums) {
  let diff = i - last;
  if (diff === 1) ones++;
  if (diff === 3) threes++;
  last = i;
}

console.log(ones * threes);

const count = memoize((t: number, x = 0): number => {
  if (t === 0) return 1;
  for (let s of range(t - 3, t)) if (nums[t] - nums[s] <= 3) x += count(s);
  return x;
});

console.log(count(nums.length - 1));
