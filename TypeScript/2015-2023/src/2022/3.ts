import { chunk } from 'lodash';
import getInput from '../lib/getInput';
import { stringToLines } from '../lib/ts-it/lines';

const input = getInput(3, 2022);
const lines = stringToLines(input);
const letters = '0abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

let result = 0;
for (const line of lines) {
  const a = new Set(line.slice(0, line.length / 2));
  const b = new Set(line.slice(line.length / 2));

  for (const x of b) {
    if (a.has(x)) {
      result += letters.indexOf(x);
    }
  }
}
console.log(result);

let result2 = 0;
for (const [a, b, c] of chunk(
  lines.map((x) => new Set(x)),
  3,
)) {
  for (const ai of a) {
    if (b.has(ai) && c.has(ai)) {
      result2 += letters.indexOf(ai);
    }
  }
}
console.log(result2);
