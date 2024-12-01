import getInput from '../lib/getInput';
import { drop } from '../lib/ts-it/drop';
import { findOrFail } from '../lib/ts-it/find';
import { first } from '../lib/ts-it/first';
import { stringToLines } from '../lib/ts-it/lines';
import { p } from '../lib/ts-it/pipe';
import { range } from '../lib/ts-it/range';
import { zip } from '../lib/ts-it/zip';

const input = getInput(25, 2020);
const [a, b] = stringToLines(input).map(Number);

function* numbers(subject: number, value = subject) {
  while (true) yield (value = (value * subject) % 20201227);
}

const aLoop = p(numbers(7))(
  (i) => zip(range(1), i),
  findOrFail(([i, v]) => v === a),
);
const bLoop = p(numbers(7))(
  (i) => zip(range(1), i),
  findOrFail(([i, v]) => v === b),
);

const key = p(numbers(aLoop[1]))(drop(bLoop[0] - 1), first);
console.log(key);
