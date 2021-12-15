import getInput from '../lib/getInput';
import { LazyGraph } from '../lib/lazy-graph/LazyGraph';
import { floor } from '../lib/math/floor';
import { stringToLines } from '../lib/ts-it/lines';
import { numbers } from '../lib/ts-it/numbers';

const input = getInput(15, 2021);
const lines = stringToLines(input).map((l) => l.split('').map(Number));
const n = lines.length;
const deltas = '0 1  1 0  -1 0  0 -1'.split('  ').map(numbers);
const graph = new LazyGraph<[number, number]>({
  getNeighbours: ([x, y]) =>
    deltas
      .map(([dx, dy]) => [x + dx, y + dy] as [number, number])
      .filter(([x, y]) => x >= 0 && y >= 0),
  getNeighbourCost: (_, [x, y]) =>
    ((lines[y % n][x % n] + floor(x / n) + floor(y / n) - 1) % 9) + 1,
});
const result1 = graph.findPath({
  startNode: [0, 0],
  isEnd: ([x, y]) => y === n - 1 && x === n - 1,
});
console.log(result1.isSuccess() && result1.cost);
const result2 = graph.findPath({
  startNode: [0, 0],
  isEnd: ([x, y]) => y === n * 5 - 1 && x === n * 5 - 1,
});
console.log(result2.isSuccess() && result2.cost);
