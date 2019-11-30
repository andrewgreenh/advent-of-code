import { reshape } from '../lib/ts-it/reshape';
import getInput from '../lib/getInput';
import { lines } from '../lib/ts-it/lines';
import { words } from '../lib/ts-it/words';
import { map } from '../lib/ts-it/map';
import { sort } from '../lib/ts-it/sort';
import { transpose } from '../lib/ts-it/transpose';
import { printGrid } from '../lib/ts-it/printGrid';

function countTri(grid) {
  let result = 0;
  for (let row of grid) {
    let [a, b, c] = sort<number>()(map(Number)(row));
    if (a + b > c) result++;
  }
  return result;
}

let grid = [
  ...map((line: string) => [...words(line)])(lines(getInput(3, 2016))),
];

console.log(countTri(grid));
console.log(countTri(reshape(3)(transpose(grid))));
