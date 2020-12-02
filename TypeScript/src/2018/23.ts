import getInput from '../lib/getInput';
import { countIf } from '../lib/ts-it/countIf';
import { stringToLines } from '../lib/ts-it/lines';
import { max } from '../lib/ts-it/max';
import { maxBy } from '../lib/ts-it/maxBy';
import { min } from '../lib/ts-it/min';
import { numbers } from '../lib/ts-it/numbers';
import { pipe } from '../lib/ts-it/pipe';
import { range } from '../lib/ts-it/range';

const bots = [] as { pos: number[]; range: number }[];
let [minX, minY, minZ, maxX, maxY, maxZ] = [] as number[];
for (const line of stringToLines(getInput(23, 2018))) {
  const [x, y, z, range] = numbers(line);
  if (!minX || x < minX) minX = x;
  if (!minY || y < minY) minY = y;
  if (!minZ || z < minZ) minZ = z;
  if (!maxX || x > maxX) maxX = x;
  if (!maxY || y > maxY) maxY = y;
  if (!maxZ || z > maxZ) maxZ = z;
  bots.push({ pos: [x, y, z], range });
}
let xs = bots.map((b) => b.pos[0]);
let ys = bots.map((b) => b.pos[1]);
let zs = bots.map((b) => b.pos[2]);

const d = (a: number[], b: number[]) =>
  Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);

const bestB = pipe(bots)(maxBy((b) => b.range))!;
console.log(pipe(bots)(countIf((b) => d(b.pos, bestB.pos) <= bestB.range)));

let dist = 1;
while (dist < maxX - minX) dist *= 2;

while (true) {
  let bestCount = 0;
  let bestPos = [0, 0, 0];
  let bestDist = 0;
  for (const x of range(min(xs), max(xs) + 1, dist)) {
    for (const y of range(min(ys), max(ys) + 1, dist)) {
      for (const z of range(min(zs), max(zs) + 1, dist)) {
        let count = pipe(bots)(
          countIf((b) => int((d(b.pos, [x, y, z]) - b.range) / dist) <= 0),
        );
        if (count > bestCount) {
          bestCount = count;
          bestPos = [x, y, z];
          bestDist = d([x, y, z], [0, 0, 0]);
        } else if (count === bestCount && d([x, y, z], [0, 0, 0]) < bestDist) {
          bestPos = [x, y, z];
          bestDist = d([x, y, z], [0, 0, 0]);
        }
      }
    }
  }
  if (dist === 1) {
    console.log(bestDist);
    break;
  }
  const [x, y, z] = bestPos;
  xs = [x - dist, x + dist];
  ys = [y - dist, y + dist];
  zs = [z - dist, z + dist];
  dist = dist / 2;
}

function int(n: number) {
  return n < 0 ? Math.ceil(n) : Math.floor(n);
}
