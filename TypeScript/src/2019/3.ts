import { intersection, min } from 'lodash';
import getInput from '../lib/getInput';
import { abs } from '../lib/math/abs';
import { parse, str } from '../lib/str';
import { iterable } from '../lib/ts-it/iterable';
import { stringToLines } from '../lib/ts-it/lines';
import { numbers } from '../lib/ts-it/numbers';
import { p } from '../lib/ts-it/pipe';
import { range } from '../lib/ts-it/range';
import { keys } from '../lib/utils';

const input = getInput(3, 2019);
const [a, b] = iterable(() => p(input)(stringToLines));

let dirs = { U: [0, -1], D: [0, 1], R: [1, 0], L: [-1, 0] };

function walk(commands: string) {
  let steps = 0;
  let [x, y] = [0, 0];
  let history: ObjectOf<number> = {};
  for (let c of commands.split(',')) {
    let n = numbers(c)[0];
    let d = c[0];
    for (let o of range(1, n + 1)) {
      steps++;
      [x, y] = [x + dirs[d][0], y + dirs[d][1]];
      if (!(str([x, y]) in history)) history[str([x, y])] = steps;
    }
  }
  return history;
}

let historyA = walk(a);
let historyB = walk(b);

const both = intersection(keys(historyA), keys(historyB));

console.log(min(both.map(parse).map(([a, b]: any) => abs(a) + abs(b))));
console.log(min(both.map((i) => historyA[i] + historyB[i])));
