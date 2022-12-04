import getInput from '../lib/getInput';
import { stringToLines } from '../lib/ts-it/lines';

const input = getInput(4, 2022);
const lines = stringToLines(input).map((x) =>
  x.split(',').flatMap((p) => p.split('-').map(Number)),
);

let resultA = 0;
let resultB = 0;
for (const [a, b, c, d] of lines) {
  if ((a >= c && b <= d) || (a <= c && b >= d)) resultA++;
  if (b >= c && a <= d) resultB++;
}

console.log(resultA);
console.log(resultB);
