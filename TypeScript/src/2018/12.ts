import getInput from '../lib/getInput';
import { log } from '../lib/log';
import { any } from '../lib/ts-it/any';
import { lines as stringToLines } from '../lib/ts-it/lines';
import { pipe } from '../lib/ts-it/pipe';
import { range } from '../lib/ts-it/range';
import { sum } from '../lib/ts-it/sum';
import { zip } from '../lib/ts-it/zip';

const lines = [...stringToLines(getInput(12, 2018))];
let state = [...lines[0].match(/: (.*$)/)![1]];
type matcher = (i: number, state: string[]) => boolean;
const rules = lines.slice(1).map((line) => {
  const [p, plant] = line.split(' => ');
  const match = (i, state) =>
    !pipe(zip(range(-2, 3), p))(any(([idx, x]) => state[idx + i] !== x));
  return [match, plant] as [matcher, string];
});

let [pad, lastResult, lastDiff, genCount] = [0, -1, -1, 200];
for (const i of range(1, genCount + 1)) {
  state.unshift('.', '.', '.'), state.push('.', '.', '.'), (pad += 3);
  let next = new Array(state.length).fill('.');
  for (const index of range(0, state.length))
    next[index] = (rules.find(([match]) => match(index, state)) || '..')[1];
  state = next;
  const result = sum(state.map((x, i) => (x === '#' ? i - pad : 0)));
  if (i === 20) log(result);
  [lastDiff, lastResult] = [result - lastResult, result];
}

log(lastResult + (50000000000 - genCount) * lastDiff);
