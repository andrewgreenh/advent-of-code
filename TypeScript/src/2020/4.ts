import getInput from '../lib/getInput';
import { fromPairs, toPairs } from '../lib/ts-it/pairs';
import { keys } from '../lib/utils';

const input = getInput(4, 2020);
const entries = input.split('\n\n').map((l) =>
  fromPairs(
    l
      .replace(/\n/g, ' ')
      .split(' ')
      .map((s) => s.split(':')),
  ),
);

const rules = {
  byr: (n) => +n >= 1920 && +n <= 2002,
  iyr: (n) => +n >= 2010 && +n <= 2020,
  eyr: (n) => +n >= 2020 && +n <= 2030,
  hgt: (n) => {
    const unit = n.match(/^\d+(in|cm)$/);
    const num = parseInt(n);
    if (unit?.[1] === 'in') return num >= 59 && num <= 76;
    if (unit?.[1] === 'cm') return num >= 150 && num <= 193;
  },
  hcl: (n) => n.match(/^#[0-9a-f]{6}$/),
  ecl: (n) => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(n),
  pid: (n) => n.match(/^\d{9}$/),
};

let result = 0;
for (const p of entries) {
  if (keys(rules).every((key) => key in p)) result++;
}
console.log(result);

let result2 = 0;
for (const p of entries) {
  if (toPairs(rules).every(([k, valid]) => p[k] && valid(p[k]))) result2++;
}
console.log(result2);
