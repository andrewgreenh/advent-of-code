import getInput from '../lib/getInput';
import { combinations } from '../lib/ts-it/combinations';
import { iterable } from '../lib/ts-it/iterable';
import { stringToLines } from '../lib/ts-it/lines';
import { map } from '../lib/ts-it/map';
import { p } from '../lib/ts-it/pipe';

const input = getInput(1, 2020);
const l = iterable(() => p(input)(stringToLines, map(Number)));

for (const [a, b] of p(l)(combinations(2))) {
  if (a + b === 2020) console.log(a * b);
}

for (const [a, b, c] of p(l)(combinations(3))) {
  if (a + b + c === 2020) console.log(a * b * c);
}
