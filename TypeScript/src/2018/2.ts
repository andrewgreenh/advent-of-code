import getInput from '../lib/getInput';
import { iterable } from '../lib/ts-it/iterable';
import { lines as stringToLines } from '../lib/ts-it/lines';

const input = getInput(2, 2018);
const lines = iterable(() => stringToLines(input));

let result;
for (const line of lines) {
  console.log(line);
}

console.log(result);
