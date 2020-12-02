import getInput from '../lib/getInput';
import { LazyGraph } from '../lib/lazy-graph/LazyGraph';
import { stringToLines } from '../lib/ts-it/lines';
import { numbers } from '../lib/ts-it/numbers';
import { range } from '../lib/ts-it/range';

const strings = [...stringToLines(getInput(22, 2018))];
const depth = numbers(strings[0])[0];
const end = [...numbers(strings[1]), 1];
const start = [0, 0, 1];
const key = ([a, b]: number[]) => `${a}%${b}`;

const cache: ObjectOf<number> = {};
function getLevel(pos: number[]) {
  const k = key(pos);
  if (cache[k] !== undefined) return cache[k];
  const [x, y] = pos;
  let index = -1;
  if (y === 0 && x === 0) index = 0;
  else if (y === 0) index = x * 16807;
  else if (x === 0) index = y * 48271;
  else index = getLevel([x - 1, y]) * getLevel([x, y - 1]);
  cache[k] = (index + depth) % 20183;
  return cache[k];
}
const risk = (pos: number[]) => getLevel(pos) % 3;
let sum = 0;
for (const y of range(0, end[1] + 1))
  for (const x of range(0, end[0] + 1)) sum += risk([x, y]);
console.log(sum);

const hashNode = (node: number[]) => node.join('---');
const abs = Math.abs;
const graph = new LazyGraph<number[]>({
  getNeighbours: ([x, y, t]) => [
    [x, y, [0, 1, 2].find((i) => i !== t && i !== risk([x, y]))!],
    ...[
      [x + 1, y, t],
      [x, y + 1, t],
      [x - 1, y, t],
      [x, y - 1, t],
    ].filter(([x, y, t]) => x >= 0 && y >= 0 && risk([x, y]) !== t),
  ],
  getNeighbourCost: (a, b) => (a[2] === b[2] ? 1 : 7),
});
const path = graph.findPath({
  estimateCost: (d) => abs(d[0] - end[0]) + abs(d[1] - end[1]),
  isEnd: (node) => hashNode(node) === hashNode(end),
  startNode: start,
});

console.log(path.isSuccess() && path.cost);
