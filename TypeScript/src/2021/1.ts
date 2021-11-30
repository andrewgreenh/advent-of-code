import getInput from '../lib/getInput'
import { stringToLines } from '../lib/ts-it/lines';

const input = getInput(1, 2021);
const lines = stringToLines(input);

let result
for (const line of lines) {
  console.log(line)
}

console.log(result)

