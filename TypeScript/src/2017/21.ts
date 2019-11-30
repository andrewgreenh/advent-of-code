import * as _ from 'lodash';

import getInput from '../lib/getInput';
import { range } from '../lib/ts-it/range';
import { toGrid } from '../lib/ts-it/toGrid';
import { transpose } from '../lib/ts-it/transpose';

let input = getInput(21, 2017).trim();
let dict = _(input)
  .split('\n')
  .map(x => x.trim().split(' => '))
  .fromPairs()
  .value();

let flip = (grid: any[][]) => grid.map(row => [...row].reverse());
let rotate = (grid: any[][]) => flip(transpose(grid));
let hash = (grid: any[][]) => grid.map(row => row.join('')).join('/');
let subGrids = (grid: any[][]) => {
  let size = grid.length;
  let subSize = size % 2 === 0 ? 2 : 3;
  let count = size / subSize;
  return _.times(count * count, i => {
    let columnOffset = i % count;
    let rowOffset = Math.floor(i / count);
    let subGrid: any[][] = new Array(subSize);
    for (let row of range(0, subSize)) {
      for (let column of range(0, subSize)) {
        if (!subGrid[row]) subGrid[row] = new Array(subSize);
        subGrid[row][column] =
          grid[row + rowOffset * subSize][column + columnOffset * subSize];
      }
    }
    return subGrid;
  });
};

let start = `.#.
..#
###`
  .split('\n')
  .map(x => x.split(''));

let allHashes = (grid: any[][]) =>
  _.flatMap(
    [grid, rotate(grid), rotate(rotate(grid)), rotate(rotate(rotate(grid)))],
    grid => [grid, flip(grid)],
  ).map(hash);

let replace = (grid: any[][]) =>
  allHashes(grid)
    .map(hash => dict[hash])
    .filter(x => !!x)[0]
    .split('/')
    .map(x => x.split(''));

let join = (grids: any[][][]) => {
  let newGrid: any[][] = [];
  let gridSize = grids[0].length;
  let gridOfGrids = toGrid<any[][]>(Math.sqrt(grids.length))(grids);
  gridOfGrids.forEach((rowOfGrids, rowOfGridsIndex) => {
    rowOfGrids.forEach((grid, columnOfGridsIndex) => {
      grid.forEach((row, rowIndex) => {
        row.forEach((column, colIndex) => {
          let finalRowIndex = rowIndex + rowOfGridsIndex * gridSize;
          let finalColumnIndex = colIndex + columnOfGridsIndex * gridSize;
          if (!newGrid[finalRowIndex]) newGrid[finalRowIndex] = [];
          newGrid[finalRowIndex][finalColumnIndex] = column;
        });
      });
    });
  });
  return newGrid;
};

let step = (grid: any[][]) => {
  let subs = subGrids(grid);
  return join(subs.map(replace));
};

let count = (grid: any[][]) =>
  _(grid)
    .flattenDeep()
    .map(x => (x === '#' ? 1 : 0))
    .sum();

let current = start;
for (let i of range(0, 18)) {
  if (i === 5) console.log(count(current));
  current = step(current);
}
console.log(count(current));
