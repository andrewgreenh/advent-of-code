import { DefaultArray } from '../lib/DefaultArray';
import getInput from '../lib/getInput';
import { flatten } from '../lib/ts-it/flatten';
import { iterable } from '../lib/ts-it/iterable';
import { lines as stringToLines } from '../lib/ts-it/lines';
import { numbers } from '../lib/ts-it/numbers';
import { pipe } from '../lib/ts-it/pipe';
import { range } from '../lib/ts-it/range';
import { sumBy } from '../lib/ts-it/sumBy';

const input = getInput(17, 2018);
const lines = iterable(() => stringToLines(input));
const grid = DefaultArray(() => DefaultArray(() => '.'));
grid[0][500] = '+';
let [maxY, minY] = [-Infinity, Infinity];
for (const line of lines) {
  const x = line.match(/x=((\d+)(\.\.(\d+))?)/)!;
  const xNums = numbers(x[1]);
  const y = line.match(/y=((\d+)(\.\.(\d+))?)/)!;
  const yNums = numbers(y[1]);
  for (const x of range(xNums[0], (xNums[1] || xNums[0]) + 1)) {
    for (const y of range(yNums[0], (yNums[1] || yNums[0]) + 1)) {
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      grid[y][x] = '#';
    }
  }
}

// printGrid(grid, '', '');
fillFrom(grid, [500, 0], fillFrom);
// printGrid(grid, '', '');

const flowing = pipe(grid.slice(minY, maxY + 1))(
  (x) => flatten<string>(x),
  sumBy((s) => (s === '|' ? 1 : 0)),
);
const resting = pipe(grid.slice(minY, maxY + 1))(
  (x) => flatten<string>(x),
  sumBy((s) => (s === '~' ? 1 : 0)),
);
console.log(flowing + resting);
console.log(resting);

function fillFrom(grid: string[][], [x, y]: number[], self: typeof fillFrom) {
  if (y >= maxY) return;
  if (grid[y + 1][x] === '.') {
    grid[y + 1][x] = '|';
    fillFrom(grid, [x, y + 1], self);
  }
  if ('#~'.includes(grid[y + 1][x]) && grid[y][x + 1] === '.') {
    grid[y][x + 1] = '|';
    fillFrom(grid, [x + 1, y], self);
  }
  if ('#~'.includes(grid[y + 1][x]) && grid[y][x - 1] === '.') {
    grid[y][x - 1] = '|';
    fillFrom(grid, [x - 1, y], self);
  }
  if (hasBothWalls(grid, [x, y])) fillLevel(grid, [x, y]);
}

function hasBothWalls(grid: string[][], pos: number[]) {
  return hasWall(grid, pos, 1) && hasWall(grid, pos, -1);
}
function hasWall(grid: string[][], [x, y]: number[], xOffset = 1) {
  let currentX = x;
  while (true) {
    if (grid[y][currentX] === '.') return false;
    if (grid[y][currentX] === '#') return true;
    currentX += xOffset;
  }
}

function fillLevel(grid: string[][], pos: number[]) {
  fillSide(grid, pos, 1), fillSide(grid, pos, -1);
}
function fillSide(grid: string[][], [x, y]: number[], xOffset = 1) {
  let currentX = x;
  while (true) {
    if (grid[y][currentX] === '#') return;
    grid[y][currentX] = '~';
    currentX += xOffset;
  }
}
