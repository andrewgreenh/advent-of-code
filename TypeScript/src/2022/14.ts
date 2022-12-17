import { range } from 'lodash';
import getInput from '../lib/getInput';
import { InfiniteGrid } from '../lib/InfiniteGrid';
import { Vector2D } from '../lib/math/vectors';
import { flatMap } from '../lib/ts-it/flatMap';
import { forEach } from '../lib/ts-it/forEach';
import { stringToLines } from '../lib/ts-it/lines';
import { numbers } from '../lib/ts-it/numbers';
import { pipe } from '../lib/ts-it/pipe';
import slide from '../lib/ts-it/slide';

const input = getInput(14, 2022);
const grid = new InfiniteGrid<'#' | '.' | '+' | 'o', '.'>(() => '.');

for (const line of stringToLines(input)) {
  const points = line.split(' -> ').map((coord) => numbers(coord) as Vector2D);
  pipe(points)(
    slide(2),
    flatMap(([[x1, y1], [x2, y2]]) => {
      if (x1 === x2) {
        const dir = Math.sign(y2 - y1);
        return range(y1, y2 + dir, dir).map((y) => [x1, y] as Vector2D);
      }
      if (y1 === y2) {
        const dir = Math.sign(x2 - x1);
        return range(x1, x2 + dir, dir).map((x) => [x, y1] as Vector2D);
      }
      throw new Error('should ne ver happen');
    }),
    forEach((v) => grid.set(v, '#')),
  );
}

const maxY = grid.maxY;
let part1Done = false;
function count() {
  console.log(
    grid
      .toGrid()
      .flat()
      .filter((c) => c === 'o').length,
  );
}
while (grid.get([500, 0]) !== 'o') {
  let sandX = 500;
  let sandY = 0;
  if (!part1Done && grid.maxY > maxY) {
    count();
    part1Done = true;
  }
  while (true) {
    if (sandY >= maxY + 2) {
      grid.set([sandX, sandY], '#');
      break;
    }
    if (grid.get([sandX, sandY + 1]) === '.') sandY++;
    else if (grid.get([sandX - 1, sandY + 1]) === '.') sandX--, sandY++;
    else if (grid.get([sandX + 1, sandY + 1]) === '.') sandX++, sandY++;
    else {
      grid.set([sandX, sandY], 'o');
      break;
    }
  }
}

count();
