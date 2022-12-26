import getInput from '../lib/getInput';
import { LazyGraph } from '../lib/lazy-graph/LazyGraph';
import { extent } from '../lib/ts-it/extent';
import { stringToLines } from '../lib/ts-it/lines';
import { numbers } from '../lib/ts-it/numbers';

const input = getInput(18, 2022);
const lines = stringToLines(input).map(numbers);

let map = new Map<string, boolean>();
for (const line of lines) {
  map.set(line.join('-'), true);
}

let part1 = 0;
let offsets = [
  [0, 0, 1],
  [0, 0, -1],
  [0, 1, 0],
  [0, -1, 0],
  [1, 0, 0],
  [-1, 0, 0],
];
for (const [x, y, z] of lines) {
  for (const [dx, dy, dz] of offsets) {
    if (!map.has([x + dx, y + dy, z + dz].join('-'))) part1++;
  }
}
console.log(part1);

const graph = new LazyGraph<[number, number, number]>({
  getNeighbours: ([x, y, z]) =>
    offsets
      .map(
        ([dx, dy, dz]) => [x + dx, y + dy, z + dz] as [number, number, number],
      )
      .filter((key) => !map.has(key.join('-'))),
});

let [minX, maxX] = extent(lines.map((l) => l[0]));
let [minY, maxY] = extent(lines.map((l) => l[1]));
let [minZ, maxZ] = extent(lines.map((l) => l[2]));
let part2 = 0;
for (const node of lines as [number, number, number][]) {
  const airNeighbours = graph.config.getNeighbours(node);
  for (const n of airNeighbours) {
    const pathToOutside = graph.findPath({
      isEnd: ([x, y, z]) =>
        x < minX! ||
        x > maxX! ||
        y < minY! ||
        y > maxY! ||
        z < minZ! ||
        z > maxZ!,
      startNode: n,
    });
    if (pathToOutside.isSuccess()) part2++;
  }
}
console.log(part2);
