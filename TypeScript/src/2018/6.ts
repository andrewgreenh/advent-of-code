import getInput from '../lib/getInput';
import { enumerate } from '../lib/ts-it/enumerate';
import { flatten } from '../lib/ts-it/flatten';
import { iterable } from '../lib/ts-it/iterable';
import { lines as stringToLines } from '../lib/ts-it/lines';
import { map } from '../lib/ts-it/map';
import { max } from '../lib/ts-it/max';
import { numbers } from '../lib/ts-it/numbers';
import { pipe } from '../lib/ts-it/pipe';
import { range } from '../lib/ts-it/range';

const input = getInput(6, 2018);
const coords = iterable(() => pipe(input)(stringToLines, map(numbers)));
const highest = pipe(coords)(flatten, max);
const counts = { '-1': -1 };
let pointsWithinRange = 0;
for (const x of range(0, highest + 1)) {
  for (const y of range(0, highest + 1)) {
    let [min, equals, minDist, totalDist] = [-1, false, Infinity, 0];
    for (const [index, [px, py]] of enumerate(coords)) {
      const dist = Math.abs(x - px) + Math.abs(y - py);
      totalDist += dist;
      if (dist === minDist) equals = true;
      if (dist < minDist) (min = index), (minDist = dist), (equals = false);
    }
    if (totalDist < 10000) pointsWithinRange++;
    if (x === 0 || x === highest || y === 0 || y === highest) counts[min] = -1;
    if (!equals && counts[min] !== -1) counts[min] = (counts[min] || 0) + 1;
  }
}
console.log(max(Object.values(counts)), pointsWithinRange);
