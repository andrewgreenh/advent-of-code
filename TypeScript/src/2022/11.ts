import { cloneDeep, sortBy } from 'lodash';
import getInput from '../lib/getInput';
import { arrayLcm } from '../lib/math/lcm';
import { numbers } from '../lib/ts-it/numbers';

const input = getInput(11, 2022);
const monkeys = input.split('\n\n').map((m) => {
  const lines = m.split('\n');
  const id = numbers(lines[0])[0];
  const items = numbers(lines[1]);
  const code = lines[2].match(/new = (.*)/)![1];
  const op: (num: number) => number = new Function(
    'old',
    'return ' + code,
  ) as any;
  const div = numbers(lines[3])[0];
  const trueTarget = numbers(lines[4])[0];
  const falseTarget = numbers(lines[5])[0];

  return {
    id,
    items,
    op,
    div,
    trueTarget,
    falseTarget,
  };
});
const monkeysTwo = cloneDeep(monkeys);

function round(
  ms: typeof monkeys,
  lower: (num: number) => number,
  cs: number[],
) {
  for (const m of ms) {
    let item: number | undefined;
    while ((item = m.items.shift())) {
      cs[m.id]++;
      const newLevel = lower(m.op(item));
      ms[newLevel % m.div === 0 ? m.trueTarget : m.falseTarget].items.push(
        newLevel,
      );
    }
  }
}

let counts1 = monkeys.map((m) => 0);
for (let i = 0; i < 20; i++) round(monkeys, (n) => Math.floor(n / 3), counts1);
const sorted1 = sortBy(counts1);
console.log(sorted1.at(-1)! * sorted1.at(-2)!);

let counts2 = monkeys.map((m) => 0);
let lcm = arrayLcm(monkeysTwo.map((m) => m.div));
for (let i = 0; i < 10000; i++) round(monkeysTwo, (n) => n % lcm, counts2);
const sorted2 = sortBy(counts2);
console.log(sorted2.at(-1)! * sorted2.at(-2)!);
