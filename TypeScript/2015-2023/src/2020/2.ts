import getInput from '../lib/getInput';
import { countBy } from '../lib/ts-it/countBy';
import { stringToLines } from '../lib/ts-it/lines';
import { p } from '../lib/ts-it/pipe';
import { xor } from '../lib/xor';

const input = getInput(2, 2020);
const lines = stringToLines(input);

let resultA = 0;
let resultB = 0;
for (const line of lines) {
  const [, from, to, letter, pw] = line.match(/(\d+)-(\d+) (\w): (\w+)/)!;
  const count = p(pw)(countBy())[letter];

  if (count >= +from && count <= +to) resultA++;
  if (xor(letter === pw[+from - 1], letter === pw[+to - 1])) resultB++;
}

console.log(resultA);
console.log(resultB);
