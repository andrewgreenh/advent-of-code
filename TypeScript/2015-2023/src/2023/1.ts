import { asyncGetInput } from '../lib/getInputAsync';
import { stringToLines } from '../lib/ts-it/lines';
import { isTruthy } from '../lib/utils';

const input = await asyncGetInput(1, 2023);

const lines = stringToLines(input);
const digitWords = 'zero one two three four five six seven eight nine'.split(
  ' ',
);

const lookup = (d: string) =>
  digitWords.indexOf(d) === -1 ? d : String(digitWords.indexOf(d));

let resultA = 0;
let resultB = 0;
for (const line of lines) {
  const digitsA = line.match(/\d/g)!;
  resultA += Number(digitsA.at(0)! + digitsA.at(-1)!);

  const digitsB = line
    .split('')
    .map(
      (c, index) =>
        line
          .slice(index)
          .match(new RegExp(`(\\d|${digitWords.join('|')})`))?.[0],
    )
    .filter(isTruthy);

  resultB += Number(lookup(digitsB.at(0)!) + lookup(digitsB.at(-1)!));
}

console.log(resultA, resultB);
