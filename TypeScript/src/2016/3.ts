import getInput from '../lib/getInput';
import { stringToLines } from '../lib/ts-it/lines';
import { map } from '../lib/ts-it/map';
import { reshape } from '../lib/ts-it/reshape';
import { sort } from '../lib/ts-it/sort';
import { transpose } from '../lib/ts-it/transpose';
import { words } from '../lib/ts-it/words';

function countTri(grid) {
  let result = 0;
  for (let row of grid) {
    let [a, b, c] = sort<number>()(map(Number)(row));
    if (a + b > c) result++;
  }
  return result;
}

let grid = [
  ...map((line: string) => [...words(line)])(stringToLines(getInput(3, 2016))),
];

console.log(countTri(grid));
console.log(countTri(reshape(3)(transpose(grid))));
