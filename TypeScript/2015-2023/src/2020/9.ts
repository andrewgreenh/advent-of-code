import { max, min, sum } from 'lodash';
import getInput from '../lib/getInput';
import { any } from '../lib/ts-it/any';
import { combinations } from '../lib/ts-it/combinations';
import { stringToLines } from '../lib/ts-it/lines';
import { p } from '../lib/ts-it/pipe';

const input = getInput(9, 2020);
const lines = stringToLines(input).map(Number);

const length = 25;
const q = lines.slice(0, length);
let target = 0;
for (const line of lines) {
  const found = p(q)(
    combinations(2),
    any(([a, b]) => a + b === line),
  );
  if (!found) target = +line;

  q.push(line);
  q.shift();
}

console.log(target);

for (let i = 0; i < lines.length; i++) {
  for (let j = i + 2; j < lines.length; j++) {
    const slice = lines.slice(i, j);
    const s = sum(slice);
    if (s > target) break;
    if (s < target) continue;
    if (s === target) console.log(min(slice)! + max(slice)!);
  }
}
