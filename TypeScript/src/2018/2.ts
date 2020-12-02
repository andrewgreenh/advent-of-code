import getInput from '../lib/getInput';
import { combinations } from '../lib/ts-it/combinations';
import { countBy } from '../lib/ts-it/countBy';
import { countIf } from '../lib/ts-it/countIf';
import { findOrFail } from '../lib/ts-it/find';
import { iterable } from '../lib/ts-it/iterable';
import { join } from '../lib/ts-it/join';
import { stringToLines } from '../lib/ts-it/lines';
import { pipe } from '../lib/ts-it/pipe';
import { zip } from '../lib/ts-it/zip';
import { values } from '../lib/utils';

const input = getInput(2, 2018);
const lines = iterable(() => stringToLines(input));

let sumDoubles = 0;
let sumTriples = 0;
for (const line of lines) {
  const counts = pipe(line)(countBy(), values);
  if (counts.includes(2)) sumDoubles++;
  if (counts.includes(3)) sumTriples++;
}
console.log(sumDoubles * sumTriples);

console.log(
  pipe(lines)(
    combinations(2, false),
    findOrFail(([a, b]) => pipe(zip(a, b))(countIf(([a, b]) => a !== b)) === 1),
    join('\n'),
  ),
);
