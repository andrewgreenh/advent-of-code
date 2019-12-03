import { intersection, min } from 'lodash';
import getInput from '../lib/getInput';
import { Vector } from '../lib/InfiniteGrid';
import { abs } from '../lib/math/abs';
import { parse, str } from '../lib/str';
import { iterable } from '../lib/ts-it/iterable';
import { lines as stringToLines } from '../lib/ts-it/lines';
import { numbers } from '../lib/ts-it/numbers';
import { p } from '../lib/ts-it/pipe';
import { range } from '../lib/ts-it/range';
import { keys } from '../lib/utils';

const input = getInput(3, 2019);
const [a, b] = iterable(() => p(input)(stringToLines));

let dirs = { U: [0, -1], D: [0, 1], R: [1, 0], L: [-1, 0] };

function walk(commands: string) {
  let steps = 0;
  let pos = [0, 0] as Vector;
  let history: ObjectOf<number> = {};
  for (let x of commands.split(',')) {
    let n = numbers(x)[0];
    let d = x[0];
    for (let o of range(1, n + 1)) {
      steps++;
      pos = [pos[0] + dirs[d][0], pos[1] + dirs[d][1]];
      if (!(str(pos) in history)) history[str(pos)] = steps;
    }
  }
  return history;
}

let historyA = walk(a);
let historyB = walk(b);

const both = intersection(keys(historyA), keys(historyB));
console.log(both);

console.log(min(both.map(parse).map(([a, b]: any) => abs(a) + abs(b))));
console.log(min(both.map(i => historyA[i] + historyB[i])));
