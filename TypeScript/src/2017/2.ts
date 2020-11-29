import { words } from '../lib/ts-it/words';
import { max } from '../lib/ts-it/max';
import { min } from '../lib/ts-it/min';
import combinations from '../lib/combinations';
import getInput from '../lib/getInput';
import { lines } from '../lib/ts-it/lines';
import { sort } from '../lib/ts-it/sort';
import { map } from '../lib/ts-it/map';

const input = getInput(2, 2017).trim();

function solve(checksum) {
  let result = 0;
  for (let line of lines(input)) {
    let nums = [...sort<number>()(map(Number)(words(line)))];
    result += checksum(nums);
  }
  return result;
}

function check1(nums: number[]) {
  return max(nums) - min(nums);
}

function check2(nums: number[]) {
  let result = 0;
  for (let [a, b] of combinations(nums, 2)) {
    if (b % a === 0) result += b / a;
  }
  return result;
}

[check1, check2].map((x) => solve(x)).forEach((x) => console.log(x));
