import { sum } from 'lodash';
import getInput from '../lib/getInput';
import { stringToLines } from '../lib/ts-it/lines';
import { numbers } from '../lib/ts-it/numbers';

const input = getInput(25, 2022);
const nums = numbers(input);
const lines = stringToLines(input);

let result = 0;
for (const line of lines) {
  result += toDecimal(line);
}

console.log(toSnafu(result));

function toDecimal(input: string): number {
  const decimals = [...input].reverse().map((c, i) => {
    if (c === '-') return -1 * 5 ** i;
    if (c === '=') return -2 * 5 ** i;
    return Number(c) * 5 ** i;
  });
  return sum(decimals);
}

function bubble(num: string[], index: number): string {
  const n = num[index];
  if (index === num.length) return num.reverse().join('');
  if (n === '2' || n === '1' || n === '0') return bubble(num, index + 1);
  if (n === '3') num[index] = '=';
  if (n === '4') num[index] = '-';
  if (n === '5') num[index] = '0';
  num[index + 1] = String(Number(num[index + 1] ?? '0') + 1);
  return bubble(num, index + 1);
}

function toSnafu(input: number): string {
  const base5 = [...input.toString(5)].reverse();
  return bubble(base5, 0);
}
