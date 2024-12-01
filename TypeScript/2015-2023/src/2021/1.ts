import getInput from '../lib/getInput';
import { countIf } from '../lib/ts-it/countIf';
import { map } from '../lib/ts-it/map';
import { numbers } from '../lib/ts-it/numbers';
import { p } from '../lib/ts-it/pipe';
import slide from '../lib/ts-it/slide';
import { sum } from '../lib/ts-it/sum';

const input = getInput(1, 2021);
const nums = numbers(input);

const part1 = p(nums)(
  slide(2),
  countIf(([a, b]) => b > a),
);
console.log(part1);

const part2 = p(nums)(
  slide(3),
  map(sum),
  slide(2),
  countIf(([a, b]) => b > a),
);
console.log(part2);
