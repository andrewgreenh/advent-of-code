import { cloneDeep } from 'lodash';
import getInput from '../lib/getInput';
import { numbers } from '../lib/ts-it/numbers';

const input = getInput(5, 2022);
const [crateDefs, moves] = input.split('\n\n').map((l) => l.split('\n'));

const initialMaxHeight = crateDefs.length - 1;
const towerCount = crateDefs[initialMaxHeight].match(/\d/g)!.length;

let towers1: string[][] = [];

for (let i = 0; i < towerCount; i++) {
  if (!towers1[i]) towers1[i] = [];
  const column = i * 4 + 1;
  for (let j = initialMaxHeight - 1; j >= 0; j--) {
    const char = crateDefs[j][column];
    if (char !== ' ') towers1[i].push(char);
  }
}

let towers2 = cloneDeep(towers1);

for (const move of moves) {
  const [count, from, to] = numbers(move);

  for (let i = 0; i < count; i++) {
    if (towers1[from - 1].length > 0) {
      towers1[to - 1].push(towers1[from - 1].pop()!);
    }
  }
}

console.log(towers1.map((t) => t.at(-1)).join(''));

for (const move of moves) {
  const [count, from, to] = numbers(move);
  if (towers2[from - 1].length > 0) {
    towers2[to - 1].push(
      ...towers2[from - 1].splice(towers2[from - 1].length - count, count)!,
    );
  }
}

console.log(towers2.map((t) => t.at(-1)).join(''));
