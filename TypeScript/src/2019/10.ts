import getInput from '../lib/getInput';
import { Vector } from '../lib/InfiniteGrid';
import { cross } from '../lib/ts-it/cross';
import { enumerate } from '../lib/ts-it/enumerate';
import { iterable } from '../lib/ts-it/iterable';
import { lines as stringToLines } from '../lib/ts-it/lines';
import { p } from '../lib/ts-it/pipe';

const input = getInput(10, 2019);
const lines = iterable(() => p(input)(stringToLines));
const grid = [...lines];

let asteroids: Vector[] = [];
for (const [rowIndex, row] of enumerate(grid)) {
  for (const [colIndex, cell] of enumerate(row)) {
    const isAsteroid = cell === '#';
    if (isAsteroid) asteroids.push([colIndex, rowIndex]);
  }
}

let maxVisible = 0;
for (const [possibleBase, target] of cross(asteroids, asteroids)) {
  const visibles = p(asteroids)();
}

function angle(v1: Vector, v2: Vector) {
  const [x1, y1] = v1;
  const [x2, y2] = v2;
  const rad = Math.atan2(y2, x2) - Math.atan2(y1, x1);
  const angle = (rad / (2 * Math.PI)) * 360;
  if (angle < 0) return angle + 360;
  return angle;
}

console.log(angle([0, 0], [1, 0]));
