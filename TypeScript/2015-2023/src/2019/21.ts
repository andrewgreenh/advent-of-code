import getInput from '../lib/getInput';
import { iterable } from '../lib/ts-it/iterable';
import { stringToLines } from '../lib/ts-it/lines';
import { p } from '../lib/ts-it/pipe';

const input = getInput(21, 2019);
const lines = iterable(() => p(input)(stringToLines));

let result;
for (const line of lines) {
  console.log(line);
}

console.log(result);
