import getInput from '../lib/getInput';
import { countBy } from '../lib/ts-it/countBy';
import { enumerate } from '../lib/ts-it/enumerate';
import { flatten } from '../lib/ts-it/flatten';
import { minBy } from '../lib/ts-it/minBy';
import { p } from '../lib/ts-it/pipe';
import { printGrid } from '../lib/ts-it/printGrid';

const data = getInput(8, 2019)
  .split('')
  .map(Number);

const rowCount = 6;
const columnCount = 25;
const img = [] as number[][][];

for (let [i, n] of enumerate(data)) {
  let l = Math.floor(i / (rowCount * columnCount));
  let r = Math.floor(i / columnCount) % rowCount;
  let c = Math.floor(i % columnCount);

  if (!img[l]) img[l] = [];
  if (!img[l][r]) img[l][r] = [];
  img[l][r][c] = n;
}

let a = p(img)(
  minBy(l =>
    p(l)(
      x => flatten<number>(x),
      countBy(),
      x => x[0],
    ),
  ),
  l => {
    const nums = flatten<number>(l!);
    const counts = countBy()(nums);
    return counts[1] * counts[2];
  },
);
console.log(a);

let result: string[][] = [];
for (const layer of img) {
  for (const [rowIndex, row] of enumerate(layer)) {
    for (const [colIndex, cell] of enumerate(row)) {
      if (!result[rowIndex]) result[rowIndex] = [];
      if (result[rowIndex][colIndex]) continue;
      if (cell === 0) result[rowIndex][colIndex] = ' ';
      if (cell === 1) result[rowIndex][colIndex] = '#';
    }
  }
}

printGrid(result, '', '');
