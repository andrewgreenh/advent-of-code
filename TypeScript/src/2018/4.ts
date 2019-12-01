import { DefaultDict } from '../lib/DefaultDict';
import getInput from '../lib/getInput';
import { cross } from '../lib/ts-it/cross';
import { enumerate } from '../lib/ts-it/enumerate';
import { iterable } from '../lib/ts-it/iterable';
import { lines as stringToLines } from '../lib/ts-it/lines';
import { maxBy } from '../lib/ts-it/maxBy';
import { numbers } from '../lib/ts-it/numbers';
import { toPairs } from '../lib/ts-it/pairs';
import { pipe } from '../lib/ts-it/pipe';
import { range } from '../lib/ts-it/range';
import { sort } from '../lib/ts-it/sort';
import { sum } from '../lib/ts-it/sum';

const input = getInput(4, 2018);
const lines = iterable(() => pipe(input)(stringToLines, sort()));

let sleepMinutesByGuard = DefaultDict(() => new Array<number>(60).fill(0));
let currentGuard: number | null = null;
let fellAsleepAt = 0;
for (const line of lines) {
  const [year, month, day, hour, minute, guardId] = numbers(line);
  if (guardId) currentGuard = guardId;
  if (line.includes('falls')) fellAsleepAt = minute;
  if (line.includes('wakes')) {
    for (let i of range(fellAsleepAt, minute)) {
      sleepMinutesByGuard[currentGuard!][i] += 1;
    }
    fellAsleepAt = 0;
  }
}

const guard = +pipe(sleepMinutesByGuard)(
  toPairs,
  maxBy(g => sum(g[1])),
)![0];

const maxMinute = pipe(sleepMinutesByGuard[guard])(
  enumerate,
  maxBy(x => x[1]),
)![0];
console.log(maxMinute * guard);

let guardId = '';
let minute = -1;
let asleepFor = 0;

for (let i of range(0, 60)) {
  const worstGuard = pipe(sleepMinutesByGuard)(
    toPairs,
    maxBy(g => g[1][i]),
  )!;
  if (worstGuard[1][i] >= asleepFor) {
    guardId = worstGuard[0];
    minute = i;
    asleepFor = worstGuard[1][i];
  }
}
console.log(+guardId * minute);

for (let i of cross(range(0, 10), range(0, 10))) console.log(i);
