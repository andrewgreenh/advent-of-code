import { fromPairs, sortBy } from 'lodash';
import getInput from '../lib/getInput';
import { last } from '../lib/ts-it/last';
import { stringToLines } from '../lib/ts-it/lines';

const input = getInput(10, 2021);
const lines = stringToLines(input);

const pairs = fromPairs('[] () {} <>'.split(' ').map((pair) => pair.split('')));
const open = Object.keys(pairs);
const pointsA = { ')': 3, ']': 57, '}': 1197, '>': 25137 };

function check(line: string) {
  const stack: string[] = [];
  for (const char of line) {
    if (open.includes(char)) stack.push(char);
    else if (pairs[last(stack)!] !== char) {
      return { type: 'Error' as const, char };
    } else {
      stack.pop();
    }
  }
  return { type: 'Incomplete' as const, stack };
}

let part1 = 0;
const incompletes = lines.filter((line) => {
  const result = check(line);
  if (result.type === 'Error') {
    part1 += pointsA[result.char];
    return false;
  }
  return true;
});
console.log(part1);

const pointsB = { ')': 1, ']': 2, '}': 3, '>': 4 };
const scores = sortBy(
  incompletes.map((line) => {
    const result = check(line);
    if (result.type === 'Error') throw new Error('wtf');
    let score = 0;
    for (const char of result.stack.reverse()) {
      score *= 5;
      score += pointsB[pairs[char]];
    }
    return score;
  }),
);
console.log(scores[Math.floor(scores.length / 2)]);
