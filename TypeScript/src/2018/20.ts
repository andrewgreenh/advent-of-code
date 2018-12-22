import { uniqBy } from 'lodash';

import { aStar } from '../lib/aStar';
import getInput from '../lib/getInput';
import { InfiniteGrid } from '../lib/InfiniteGrid';
import { filter } from '../lib/ts-it/filter';
import { len } from '../lib/ts-it/len';
import { map } from '../lib/ts-it/map';
import { max } from '../lib/ts-it/max';
import { pipe } from '../lib/ts-it/pipe';
import { printGrid } from '../lib/ts-it/printGrid';

const regex = getInput(20, 2018).slice(1, -1);

type Vector = [number, number];
const maze = new InfiniteGrid<string>();

let start = [0, 0] as [number, number];
let starts: Vector[] = [];
let ends: Vector[] = [];
let stack: [Vector[], Vector[]][] = [];
let positions: Vector[] = [start];
maze.set(start, 'X');

const combine = (a: Vector[], b: Vector[]) =>
  uniqBy(a.concat(b), i => i.join('-'));

for (const c of regex) {
  if (c === 'N') {
    positions = positions.map(([x, y]) => {
      maze.set([x, y - 1], '-');
      maze.set([x, y - 2], '.');
      return [x, y - 2] as Vector;
    });
  }
  if (c === 'E') {
    positions = positions.map(([x, y]) => {
      maze.set([x + 1, y], '|');
      maze.set([x + 2, y], '.');
      return [x + 2, y] as Vector;
    });
  }
  if (c === 'S') {
    positions = positions.map(([x, y]) => {
      maze.set([x, y + 1], '-');
      maze.set([x, y + 2], '.');
      return [x, y + 2] as Vector;
    });
  }
  if (c === 'W') {
    positions = positions.map(([x, y]) => {
      maze.set([x - 1, y], '|');
      maze.set([x - 2, y], '.');
      return [x - 2, y] as Vector;
    });
  }
  if (c === '(') {
    stack.push([starts, ends]);
    [starts, ends] = [positions, []];
  }
  if (c === ')') {
    positions = combine(ends, positions);
    [starts, ends] = stack.pop()!;
  }
  if (c === '|') {
    ends = combine(ends, positions);
    positions = starts;
  }
}

printGrid(maze.toGrid(), '#', '');

const aStartResult = aStar<Vector>({
  getNeighbourCost: () => 1,
  getNeighbours: ([x, y]) => {
    const n = [] as Vector[];
    if ('-|'.includes(maze.get([x + 1, y]) || '#')) n.push([x + 2, y]);
    if ('-|'.includes(maze.get([x - 1, y]) || '#')) n.push([x - 2, y]);
    if ('-|'.includes(maze.get([x, y + 1]) || '#')) n.push([x, y + 2]);
    if ('-|'.includes(maze.get([x, y - 1]) || '#')) n.push([x, y - 2]);
    return n;
  },
  hashData: pos => pos.join('-'),
  isEnd: () => false,
  startNode: start,
});

const result = pipe(aStartResult.getExpandedNodes())(map(n => n.g), max);
console.log(result);
const result2 = pipe(aStartResult.getExpandedNodes())(
  filter(n => n.g >= 1000),
  len,
);
console.log(result2);
