import { binarySearch } from '../lib/binarySearch';
import getInput from '../lib/getInput';
import { findOrFail } from '../lib/ts-it/find';
import { stringToLines } from '../lib/ts-it/lines';
import { max } from '../lib/ts-it/max';
import { pipe } from '../lib/ts-it/pipe';
import slide from '../lib/ts-it/slide';
import { sort } from '../lib/ts-it/sort';

const input = getInput(5, 2020);
const lines = stringToLines(input);

const seatId = (row, col) => row * 8 + col;

let ids = [] as number[];
for (const line of lines) {
  const topDown = [...line.slice(0, 7)];
  const leftRight = [...line.slice(7)];

  const row = binarySearch({
    max: 128,
    isBelow: () => topDown.shift() === 'F',
  });

  const col = binarySearch({
    max: 8,
    isBelow: () => leftRight.shift() === 'L',
  });

  const id = seatId(row, col);
  ids.push(id);
}
console.log(max(ids));

pipe(ids)(
  sort(),
  slide(2),
  findOrFail(([a, b]) => b - a === 2),
  (x) => console.log(x[0] + 1),
);
