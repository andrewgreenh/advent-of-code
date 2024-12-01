import { assert } from '../lib/assert';
import { fourDirectionOffsets } from '../lib/directions';
import getInput from '../lib/getInput';
import { InfiniteGrid } from '../lib/InfiniteGrid';
import { LazyGraph } from '../lib/lazy-graph/LazyGraph';
import { Vector2D } from '../lib/math/vectors';
import { printGrid } from '../lib/ts-it/printGrid';
import { isTruthy } from '../lib/utils';

const input = getInput(24, 2022);
const grid = input.split('\n').map((row) => row.split(''));

const height = grid.length - 2;
const width = grid[0].length - 2;

const dirs = {
  up: {
    freeSpots: grid[0].map((_, x) =>
      grid
        .map((row, y) => (row[x] === '^' || row[x] === '#' ? null : y))
        .filter(isTruthy),
    ),
    offset: (round: number, i: number) => {
      const n = i - 1;
      const result = (n - round) % height;
      if (result < 0) return height - -result + 1;
      return result + 1;
    },
  },
  down: {
    freeSpots: grid[0].map((_, x) =>
      grid
        .map((row, y) => (row[x] === 'v' || row[x] === '#' ? null : y))
        .filter(isTruthy),
    ),
    offset: (round: number, i: number) => ((i - 1 + round) % height) + 1,
  },
  left: {
    freeSpots: grid.map((row) =>
      row.map((c, i) => (c === '<' || c === '#' ? null : i)).filter(isTruthy),
    ),
    offset: (round: number, i: number) => {
      const n = i - 1;
      const result = (n - round) % width;
      if (result < 0) return width - -result + 1;
      return result + 1;
    },
  },
  right: {
    freeSpots: grid.map((row) =>
      row.map((c, i) => (c === '>' || c === '#' ? null : i)).filter(isTruthy),
    ),
    offset: (round: number, i: number) => ((i - 1 + round) % width) + 1,
  },
};

type AllowedInfoCharacter =
  | '1'
  | '2'
  | '3'
  | '4'
  | '#'
  | '.'
  | '<'
  | '>'
  | '^'
  | 'v';
function getPositionInfo(
  x: number,
  y: number,
  round: number,
): AllowedInfoCharacter {
  if (x === 1 && y === 0) return '.';
  if (x === width && y === height + 1) return '.';
  if (x === 0 || x === width + 1) return '#';
  if (y === 0 || y === height + 1) return '#';
  const icons: AllowedInfoCharacter[] = [];
  if (!dirs.down.freeSpots[x] || !dirs.left.freeSpots[y]) return '#';
  if (dirs.down.freeSpots[x].every((n) => dirs.down.offset(round, n) !== y))
    icons.push('v');
  if (dirs.up.freeSpots[x].every((n) => dirs.up.offset(round, n) !== y))
    icons.push('^');
  if (dirs.right.freeSpots[y].every((n) => dirs.right.offset(round, n) !== x))
    icons.push('>');
  if (dirs.left.freeSpots[y].every((n) => dirs.left.offset(round, n) !== x))
    icons.push('<');

  if (icons.length === 1) return icons[0];
  if (icons.length > 0) return String(icons.length) as any;
  return '.';
}

const dGrid = new InfiniteGrid();
dGrid.set([0, 0], '#');
dGrid.set([width + 1, height + 1], '#');

function displayRound(round: number) {
  printGrid(
    dGrid
      .toGrid()
      .map((row, y) => row.map((_, x) => getPositionInfo(x, y, round))),
    '',
    '',
  );
}

const graph = new LazyGraph<{ x: number; y: number; round: number }>({
  getNeighbours: ({ x, y, round }) => {
    return [...fourDirectionOffsets, [0, 0] as Vector2D]
      .map(([dx, dy]) => {
        if (getPositionInfo(x + dx, y + dy, round + 1) === '.') {
          return { x: x + dx, y: y + dy, round: round + 1 };
        }
        return null;
      })
      .filter(isTruthy);
  },
});

const start = { x: 1, y: 0 };
const end = { x: width, y: height + 1 };

const result = graph.findPath({
  isEnd: ({ x, y }) => x === end.x && y === end.y,
  startNode: { ...start, round: 0 },
});

assert(result.isSuccess());

const result2 = graph.findPath({
  isEnd: ({ x, y }) => x === start.x && y === start.y,
  startNode: { ...end, round: result.cost },
});

assert(result2.isSuccess());

const result3 = graph.findPath({
  isEnd: ({ x, y }) => x === end.x && y === end.y,
  startNode: { ...start, round: result.cost + result2.cost },
});

assert(result3.isSuccess());

console.log(result.cost);
console.log(result.cost + result2.cost + result3.cost);
