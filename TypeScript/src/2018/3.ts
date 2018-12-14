import getInput from '../lib/getInput';
import { filter } from '../lib/ts-it/filter';
import { first } from '../lib/ts-it/first';
import { flatten } from '../lib/ts-it/flatten';
import { len } from '../lib/ts-it/len';
import { lines as stringToLines } from '../lib/ts-it/lines';
import { map } from '../lib/ts-it/map';
import { numbers } from '../lib/ts-it/numbers';
import { pipe } from '../lib/ts-it/pipe';
import { range } from '../lib/ts-it/range';
import { toGrid } from '../lib/ts-it/toGrid';

const input = getInput(3, 2018);
const claims = pipe(input)(stringToLines, map(numbers));

const n = 1000;
const grid = toGrid(n)(Array(n * n));
const overlapped = new Set();

for (const [id, left, top, width, height] of claims) {
  for (const x of range(left, left + width)) {
    for (const y of range(top, top + height)) {
      if (grid[y][x]) {
        overlapped.add(grid[y][x]);
        overlapped.add(id);
        grid[y][x] = Infinity;
      } else grid[y][x] = id;
    }
  }
}
console.log(pipe(grid)(flatten, filter(x => x === Infinity), len));

console.log(pipe(grid)(flatten, filter(x => x && !overlapped.has(x)), first));
