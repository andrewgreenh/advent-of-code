import { sum } from 'lodash';
import getInput from '../lib/getInput';
import { stringToLines } from '../lib/ts-it/lines';

const input = getInput(14, 2020);
const lines = stringToLines(input);

let mem = {} as any;
let mask = '';
for (const line of lines) {
  if (line.includes('mask')) {
    mask = line.match(/= (.*)/)![1];
  } else {
    let [, adress, value] = line.match(/\[(.*)\] = (\d+)/)!;
    let binaryValue = (+value).toString(2).padStart(36, '0').split('');
    mask.split('').forEach((c, i) => {
      if (c !== 'X') binaryValue[i] = c;
    });
    let newDecimal = parseInt(binaryValue.join(''), 2);
    mem[adress] = newDecimal;
  }
}
console.log(sum(Object.values(mem)));

mem = {} as any;
mask = '';
for (const line of lines) {
  if (line.includes('mask')) {
    mask = line.match(/= (.*)/)![1];
  } else {
    let [, adress, value] = line.match(/\[(.*)\] = (\d+)/)!;
    let binaryValue = (+adress).toString(2).padStart(36, '0').split('');

    mask.split('').forEach((c, i) => {
      if (c !== '0') {
        binaryValue[i] = c;
      }
    });

    function* getNumbers(
      bitsToExpand: Iterable<string>,
      expandedBits: string,
    ): Generator<string> {
      let [next, ...remaining] = bitsToExpand;
      if (!next) return yield expandedBits;
      if (next === 'X') {
        yield* getNumbers(remaining, expandedBits + '0');
        yield* getNumbers(remaining, expandedBits + '1');
      } else {
        yield* getNumbers(remaining, expandedBits + next);
      }
    }

    for (const c of getNumbers(binaryValue, '')) {
      mem[parseInt(c, 2)] = +value;
    }
  }
}

console.log(sum(Object.values(mem)));
