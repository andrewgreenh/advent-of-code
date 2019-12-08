import getInput from '../lib/getInput';
import { chunk } from '../lib/ts-it/chunk';
import { countBy } from '../lib/ts-it/countBy';
import { enumerate } from '../lib/ts-it/enumerate';
import { flatten } from '../lib/ts-it/flatten';
import { iterable } from '../lib/ts-it/iterable';
import { map } from '../lib/ts-it/map';
import { minBy } from '../lib/ts-it/minBy';
import { p } from '../lib/ts-it/pipe';
import { printGrid } from '../lib/ts-it/printGrid';

const data = getInput(8, 2019)
  .split('')
  .map(Number);

const rows = 6;
const cols = 25;
let img = iterable(() => p(data)(chunk(rows * cols), map(chunk(cols))));

let a = p(img)(
  map(x => countBy()(flatten<number>(x))),
  minBy(l => l[0]),
  l => l![1] * l![2],
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
