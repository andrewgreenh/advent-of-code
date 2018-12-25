import getInput from '../lib/getInput';
import { lines } from '../lib/ts-it/lines';
import { map } from '../lib/ts-it/map';
import { numbers } from '../lib/ts-it/numbers';
import { pipe } from '../lib/ts-it/pipe';
import { toArray } from '../lib/ts-it/toArray';

const points = pipe(getInput(25, 2018))(lines, map(numbers), toArray);
const abs = Math.abs;
const getNeighbours = ([x1, y1, z1, t1]: number[]) =>
  points.filter(
    ([x2, y2, z2, t2]) =>
      abs(x1 - x2) + abs(y1 - y2) + abs(z1 - z2) + abs(t1 - t2) <= 3,
  );

const keys = new Set<string>();
const key = (p: number[]) => p.join('---');
const groups: number[][][] = [];
while (keys.size !== points.length) {
  const start = points.find(p => !keys.has(key(p)))!;
  const queue = [start];
  const group = [start];
  while (queue.length) {
    const next = queue.pop()!;
    for (const n of getNeighbours(next)) {
      if (keys.has(key(n))) continue;
      keys.add(key(n));
      group.push(n);
      queue.push(n);
    }
  }
  groups.push(group);
}
console.log(groups.length);
