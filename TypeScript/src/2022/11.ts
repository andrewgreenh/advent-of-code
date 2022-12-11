import { cloneDeep, sortBy } from 'lodash';
import getInput from '../lib/getInput';
import { arrayLcm } from '../lib/math/lcm';
import { numbers } from '../lib/ts-it/numbers';

const input = getInput(11, 2022);
const monkeys = input.split('\n\n').map((m, id) => {
  const lines = m.split('\n');
  return {
    id,
    items: numbers(lines[1]),
    op: new Function('old', 'return ' + lines[2].match(/new = (.*)/)![1]),
    div: numbers(lines[3])[0],
    trueTarget: numbers(lines[4])[0],
    falseTarget: numbers(lines[5])[0],
  };
});
const monkeys2 = cloneDeep(monkeys);

function round(
  ms: typeof monkeys,
  lower: (num: number) => number,
  cs: number[],
) {
  for (const m of ms) {
    let item: number | undefined;
    while ((item = m.items.shift())) {
      cs[m.id]++;
      const next = lower(m.op(item));
      ms[next % m.div === 0 ? m.trueTarget : m.falseTarget].items.push(next);
    }
  }
}

let counts1 = monkeys.map((m) => 0);
for (let i = 0; i < 20; i++) round(monkeys, (n) => Math.floor(n / 3), counts1);
const sorted1 = sortBy(counts1);
console.log(sorted1.at(-1)! * sorted1.at(-2)!);

let counts2 = monkeys.map((m) => 0);
let lcm = arrayLcm(monkeys2.map((m) => m.div));
for (let i = 0; i < 10000; i++) round(monkeys2, (n) => n % lcm, counts2);
const sorted2 = sortBy(counts2);
console.log(sorted2.at(-1)! * sorted2.at(-2)!);
