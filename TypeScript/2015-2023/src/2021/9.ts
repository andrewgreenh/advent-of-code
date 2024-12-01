import { sortBy, sumBy, uniqBy } from 'lodash';
import getInput from '../lib/getInput';
import { Vector } from '../lib/InfiniteGrid';
import { stringToLines } from '../lib/ts-it/lines';

const input = getInput(9, 2021);
const lines = stringToLines(input).map((l) => l.split('').map(Number));
const cross = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

let lowPoints = [] as Vector[];
for (let y = 0; y < lines.length; y++) {
  for (let x = 0; x < lines[y].length; x++) {
    if (
      cross.every(([dx, dy]) => (lines[y + dy]?.[x + dx] ?? 10) > lines[y][x])
    )
      lowPoints.push([x, y]);
  }
}

console.log(sumBy(lowPoints, ([x, y]) => lines[y][x] + 1));

const basins = lowPoints.map((start) => ({ coords: [start] }));
for (const basin of basins) {
  for (let i = 0; i < basin.coords.length; i++) {
    const [x, y] = basin.coords[i];
    for (const [dx, dy] of cross) {
      const neighbour = lines[y + dy]?.[x + dx] ?? 10;
      if (neighbour < 9 && neighbour > lines[y][x]) {
        basin.coords.push([x + dx, y + dy]);
      }
    }
  }
}

const basinsWithUniqueCoords = basins.map(({ coords }) =>
  uniqBy(coords, (c) => c.join('-')),
);

console.log(
  sortBy(basinsWithUniqueCoords, (b) => -b.length)
    .slice(0, 3)
    .reduce((a, b) => a * b.length, 1),
);
