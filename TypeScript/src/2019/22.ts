import getInput from '../lib/getInput';
import { iterable } from '../lib/ts-it/iterable';
import { lines as stringToLines } from '../lib/ts-it/lines';
import { numbers } from '../lib/ts-it/numbers';
import { p } from '../lib/ts-it/pipe';

const input = getInput(22, 2019);
const lines = iterable(() => p(input)(stringToLines));

const cardCount = 10007;

const commandsByKey = {
  'deal into new stack': (a: void, currentIndex: number) => {
    return cardCount - 1 - currentIndex;
  },
  cut: (a: number, currentIndex: number) => {
    return (currentIndex + (cardCount - a)) % cardCount;
  },
  'deal with increment': (a: number, currentIndex: number) => {
    return (currentIndex * a) % cardCount;
  },
};

let i = 2019;
for (const line of lines) {
  const a = numbers(line)[0];
  const c = line.match(/[a-z ]*/)![0].trim();
  i = commandsByKey[c](a, i);
}
console.log(i);
