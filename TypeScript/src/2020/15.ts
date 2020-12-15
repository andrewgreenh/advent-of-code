import { last } from 'lodash';
import getInput from '../lib/getInput';
import { numbers } from '../lib/ts-it/numbers';

const input = getInput(15, 2020);
const nums = numbers(input);

const indicesByNum = new Array<number>(30000000);
nums.slice(0, -1).forEach((n, i) => (indicesByNum[n] = i));

let length = nums.length;
let lastNumber = last(nums)!;
while (length < 30000000) {
  if (length === 2020) console.log(lastNumber);
  let index = indicesByNum[lastNumber] ?? -1;
  indicesByNum[lastNumber] = length - 1;
  let next = index === -1 ? 0 : length - index - 1;
  lastNumber = next;
  length++;
}
console.log(lastNumber);
