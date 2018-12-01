import getInput from '../lib/getInput';
import { accumulate } from '../lib/ts-it/accumulate';
import { cycle } from '../lib/ts-it/cycle';
import { find } from '../lib/ts-it/find';
import { iterable } from '../lib/ts-it/iterable';
import { lines as stringToLines } from '../lib/ts-it/lines';
import { sum } from '../lib/ts-it/sum';

const input = getInput(1, 2018);
const frequencies = iterable(() => stringToLines(input));

console.log(sum(frequencies));

const history = new Set([0]);
console.log(
  find((n: number) => history.has(n) || !history.add(n))(
    accumulate(cycle(frequencies)),
  ),
);
