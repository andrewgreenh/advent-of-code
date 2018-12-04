import { format, getMinutes } from 'date-fns';

import getInput from '../lib/getInput';
import { flatten } from '../lib/ts-it/flatten';
import { iterable } from '../lib/ts-it/iterable';
import { lines as stringToLines } from '../lib/ts-it/lines';
import { map } from '../lib/ts-it/map';
import { maxBy } from '../lib/ts-it/maxBy';
import { numbers } from '../lib/ts-it/numbers';
import { pipe } from '../lib/ts-it/pipe';
import { range } from '../lib/ts-it/range';
import { sort } from '../lib/ts-it/sort';
import { sum } from '../lib/ts-it/sum';
import { sumBy } from '../lib/ts-it/sumBy';

const input = getInput(4, 2018);
const lines = iterable(() =>
  pipe(input)(
    stringToLines,
    sort((a, b) => (a < b ? -1 : 1)),
    map(line => {
      const [, date, command] = line.match(
        /(\d{4}-\d{2}-\d{2} \d{2}:\d{2})] (.*)/,
      )!;
      const d = new Date(date);
      return {
        command,
        day: format(d, 'MM-DD'),
        minutes: getMinutes(d),
      };
    }),
  ),
);

let minutesPerGuardPerDay: Record<string, Record<string, number[]>> = {};
let activeGuard = -1;
for (const line of lines) {
  if (line.command.includes('begins shift')) {
    activeGuard = numbers(line.command)[0];
    continue;
  }
  if (!minutesPerGuardPerDay[activeGuard])
    minutesPerGuardPerDay[activeGuard] = {};

  if (!minutesPerGuardPerDay[activeGuard][line.day])
    minutesPerGuardPerDay[activeGuard][line.day] = [];
  const sleepValue = line.command.includes('wakes up') ? 0 : 1;
  for (const time of range(line.minutes, 60)) {
    minutesPerGuardPerDay[activeGuard][line.day][time] = sleepValue;
  }
}

const guards = iterable(() =>
  pipe(minutesPerGuardPerDay)(
    Object.entries,
    map(([id, sleepTimesPerDay]: [string, Record<string, number[]>]) => ({
      id,
      totalSleepTime: sum(flatten(Object.values(sleepTimesPerDay))),
      maxMinutes: getMinuteMax(sleepTimesPerDay),
    })),
  ),
);

const strategy1 = pipe(guards)(maxBy(guard => guard.totalSleepTime))!;
console.log(+strategy1.id * strategy1.maxMinutes.minute);

const strategy2 = pipe(guards)(maxBy(guard => guard.maxMinutes.sleepCounts))!;
console.log(+strategy2.id * strategy2.maxMinutes.minute);

function getMinuteMax(sleepTimesPerDay) {
  return pipe(range(0, 60))(
    map(minute => ({
      minute,
      sleepCounts: pipe(sleepTimesPerDay)(
        Object.values,
        sumBy(times => times[minute]),
      ),
    })),
    maxBy(m => m.sleepCounts),
  )!;
}
