import getInput from '../lib/getInput';
import { InfiniteGrid } from '../lib/InfiniteGrid';
import { countIf } from '../lib/ts-it/countIf';
import { every } from '../lib/ts-it/every';
import { findOrFail } from '../lib/ts-it/find';
import { first } from '../lib/ts-it/first';
import { flatten } from '../lib/ts-it/flatten';
import { iterable } from '../lib/ts-it/iterable';
import { lines as stringToLines } from '../lib/ts-it/lines';
import { map } from '../lib/ts-it/map';
import { numbers } from '../lib/ts-it/numbers';
import { pipe } from '../lib/ts-it/pipe';
import { rectangle } from '../lib/ts-it/rectCoords';

const input = getInput(3, 2018);
const lines = iterable(() => stringToLines(input));

let grid = new InfiniteGrid<number, number>(() => 0);

for (const line of lines) {
  const [, x, y, w, h] = numbers(line);
  for (let i = x; i < x + w; i++) {
    for (let j = y; j < y + h; j++) {
      const current = grid.get([i, j]);
      grid.set([i, j], current + 1);
    }
  }
}

console.log(
  pipe(grid)(
    (g) => g.toGrid(),
    (_) => flatten<number>(_),
    countIf((n) => !!n && n > 1),
  ),
);

console.log(
  pipe(lines)(
    map(numbers),
    findOrFail(([, x, y, w, h]) =>
      pipe(rectangle(x, x + w, y, y + h))(
        every(([x, y]) => grid.get([x, y]) === 1),
      ),
    ),
    first,
  ),
);
