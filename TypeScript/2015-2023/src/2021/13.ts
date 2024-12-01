import { maxBy, sumBy } from 'lodash';
import getInput from '../lib/getInput';
import { numbers } from '../lib/ts-it/numbers';
import { printGrid } from '../lib/ts-it/printGrid';

const input = getInput(13, 2021);
const [dataString, instructionString] = input.split('\n\n');
const data = dataString.split('\n').map(numbers);
let grid: string[][] = [];

const maxX = maxBy(data, (n) => n[0])![0];
const maxY = maxBy(data, (n) => n[1])![1];

for (let x = 0; x <= maxX; x++) {
  for (let y = 0; y <= maxY; y++) {
    if (!grid[y]) grid[y] = [];
    grid[y][x] = '.';
  }
}
for (const [x, y] of data) {
  grid[y][x] = '#';
}

const instructions = instructionString.split('\n').map((l) => {
  const [, direction, num] = l.match(/(.)=(\d+)/)!;
  return { direction, num: Number(num) };
});

let i = 0;
for (const ins of instructions) {
  let newGrid: typeof grid = [];
  grid.forEach((row, y) =>
    row.forEach((cell, x) => {
      if (ins.direction === 'x' && x > ins.num) {
        x = ins.num - (x - ins.num);
      } else if (ins.direction === 'y' && y > ins.num) {
        y = ins.num - (y - ins.num);
      }
      if (!newGrid[y]) newGrid[y] = [];
      if (newGrid[y][x] !== '#') newGrid[y][x] = cell;
    }),
  );
  grid = newGrid;
  if (i++ === 0) console.log(sumBy(grid.flat(), (n) => (n === '#' ? 1 : 0)));
}
printGrid(grid, undefined, '');
