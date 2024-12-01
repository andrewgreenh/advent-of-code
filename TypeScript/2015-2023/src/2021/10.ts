import { sortBy } from 'lodash';
import getInput from '../lib/getInput';
import { stringToLines } from '../lib/ts-it/lines';

const input = getInput(10, 2021);
const lines = stringToLines(input);

const pairs = { '[': ']', '(': ')', '{': '}', '<': '>' };
const pointsA = { ')': 3, ']': 57, '}': 1197, '>': 25137 };
const pointsB = { ')': 1, ']': 2, '}': 3, '>': 4 };

let part1 = 0;
let part2Scores: number[] = [];
linesLoop: for (const line of lines) {
  const stack: string[] = [];
  for (const char of line) {
    if (char in pairs) stack.push(char);
    else if (char !== pairs[stack.pop()!]) {
      part1 += pointsA[char];
      continue linesLoop;
    }
  }
  let score = 0;
  for (const char of stack.reverse()) score = score * 5 + pointsB[pairs[char]];
  part2Scores.push(score);
}
console.log(part1);
console.log(sortBy(part2Scores)[Math.floor(part2Scores.length / 2)]);
