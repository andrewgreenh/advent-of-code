import getInput from '../lib/getInput';
import { InfiniteGrid } from '../lib/InfiniteGrid';
import { log } from '../lib/log';
import { stringToLines } from '../lib/ts-it/lines';
import { map } from '../lib/ts-it/map';
import { numbers } from '../lib/ts-it/numbers';
import { pipe } from '../lib/ts-it/pipe';
import { printGrid } from '../lib/ts-it/printGrid';
import { range } from '../lib/ts-it/range';

let p = [...pipe(getInput(10, 2018))(stringToLines, map(numbers))];

for (const i of range(1, 11000)) {
  const g = new InfiniteGrid<string>();
  p = p.map(([x, y, vx, vy]) => [x + vx, y + vy, vx, vy]);
  p.forEach(([x, y]) => g.set([x, y], '#'));
  if (Math.abs(g.maxY - g.minY) <= 10) printGrid(g.toGrid(), ' ', ' '), log(i);
}
