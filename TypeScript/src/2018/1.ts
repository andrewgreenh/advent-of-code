import getInput from '../lib/getInput';
import { accumulate } from '../lib/ts-it/accumulate';
import { cycle } from '../lib/ts-it/cycle';
import { find } from '../lib/ts-it/find';
import { iterable } from '../lib/ts-it/iterable';
import { last } from '../lib/ts-it/last';
import { lines as stringToLines } from '../lib/ts-it/lines';
import { pipe } from '../lib/ts-it/pipe';

const input = getInput(1, 2018);
const lines = iterable(() => stringToLines(input));

let result1 = pipe(lines)(accumulate, last);
console.log(result1);

let history = new Set();
let result2 = pipe(lines)(
  cycle,
  accumulate,
  find(x => history.has(x) || !history.add(x)),
);
console.log(result2);
