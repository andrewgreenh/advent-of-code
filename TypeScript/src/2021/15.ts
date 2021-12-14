import getInput from '../lib/getInput'
import { stringToLines } from '../lib/ts-it/lines';
import { numbers } from '../lib/ts-it/numbers';

const input = getInput(15, 2021);
const nums = numbers(input);
const lines = stringToLines(input);

let result
for (const line of lines) {
  console.log(line)
}

console.log(result)

