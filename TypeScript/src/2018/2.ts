import getInput from '../lib/getInput';
import { combinations } from '../lib/ts-it/combinations';
import { countBy } from '../lib/ts-it/countBy';
import { find } from '../lib/ts-it/find';
import { iterable } from '../lib/ts-it/iterable';
import { lines as stringToLines } from '../lib/ts-it/lines';
import { pipe } from '../lib/ts-it/pipe';
import { sumBy } from '../lib/ts-it/sumBy';
import { zip } from '../lib/ts-it/zip';

const input = getInput(2, 2018);
const lines = iterable(() => stringToLines(input));

let twoLetters = 0;
let threeLetters = 0;
for (const line of lines) {
  const counts = pipe(line)(countBy(), Object.values);
  if (counts.includes(2)) twoLetters++;
  if (counts.includes(3)) threeLetters++;
}
console.log(twoLetters * threeLetters);

const idPairs = pipe(lines)(combinations(2));
const similar = pipe(idPairs)(
  find(([a, b]) => pipe(zip(a, b))(sumBy(([a, b]) => (a === b ? 0 : 1))) === 1),
);
console.log(similar);
