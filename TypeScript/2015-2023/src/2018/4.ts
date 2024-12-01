import { DefaultDict } from '../lib/DefaultDict';
import getInput from '../lib/getInput';
import { cross } from '../lib/ts-it/cross';
import { enumerate } from '../lib/ts-it/enumerate';
import { iterable } from '../lib/ts-it/iterable';
import { stringToLines } from '../lib/ts-it/lines';
import { maxBy } from '../lib/ts-it/maxBy';
import { numbers } from '../lib/ts-it/numbers';
import { toPairs } from '../lib/ts-it/pairs';
import { p } from '../lib/ts-it/pipe';
import { range } from '../lib/ts-it/range';
import { sort } from '../lib/ts-it/sort';
import { sum } from '../lib/ts-it/sum';
import { keys } from '../lib/utils';

const input = getInput(4, 2018);
const lines = iterable(() => p(input)(stringToLines, sort()));

let minsByGuard = DefaultDict(() => new Array<number>(60).fill(0));
let currentGuard: number | null = null;
let fellAsleepAt = 0;
for (const line of lines) {
  const [year, month, day, hour, minute, guardId] = numbers(line);
  if (guardId) currentGuard = guardId;
  if (line.includes('falls')) fellAsleepAt = minute;
  if (line.includes('wakes')) {
    for (let i of range(fellAsleepAt, minute)) {
      minsByGuard[currentGuard!][i] += 1;
    }
    fellAsleepAt = 0;
  }
}

const guard = +p(minsByGuard)(
  toPairs,
  maxBy((g) => sum(g[1])),
)![0];

const maxMinute = p(minsByGuard[guard])(
  enumerate,
  maxBy((x) => x[1]),
)![0];
console.log(maxMinute * guard);

const combinations = cross(keys(minsByGuard), range(0, 60));
const [guardId, minute] = p(combinations)(
  maxBy(([guardId, minute]) => minsByGuard[guardId][minute]),
)!;

console.log(+guardId * minute);
