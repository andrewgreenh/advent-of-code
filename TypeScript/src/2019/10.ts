import getInput from '../lib/getInput';
import { Vector } from '../lib/InfiniteGrid';
import { str } from '../lib/str';
import { enumerate } from '../lib/ts-it/enumerate';
import { iterable } from '../lib/ts-it/iterable';
import { lines as stringToLines } from '../lib/ts-it/lines';
import { p } from '../lib/ts-it/pipe';
import { sortBy } from '../lib/ts-it/sortBy';
import { toArray } from '../lib/ts-it/toArray';
import { values } from '../lib/utils';
import _ = require('lodash');

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

let maxVisibleBase: Vector = [0, 0];
let maxVisibleTargets: Vector[] = [];
for (let pot of asteroids) {
  let angles = _.groupBy(
    asteroids.filter(x => str(x) !== str(pot)),
    a => angle(pot, a),
  );
  let visible = values(
    _.mapValues(
      angles,
      a => _.sortBy(a, a => Math.hypot(a[0] - pot[0], a[1] - pot[1]))[0],
    ),
  );
  if (visible.length > maxVisibleTargets.length) {
    maxVisibleTargets = visible;
    maxVisibleBase = pot;
  }
}
console.log(maxVisibleTargets.length);

let sorted = p(maxVisibleTargets)(
  sortBy(t => angle(maxVisibleBase, t)),
  toArray,
)[199];
console.log(sorted[0] * 100 + sorted[1]);

function angle(v1: Vector, v2: Vector) {
  const [x1, y1] = v1;
  const [x2, y2] = v2;
  const rad = Math.atan2(y2 - y1, x2 - x1);
  const angle = _.round((rad / (2 * Math.PI)) * 360 + 90, 6);
  if (angle < 0) return angle + 360;
  return angle;
}
