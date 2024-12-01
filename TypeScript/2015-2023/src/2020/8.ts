import { range } from 'lodash';
import getInput from '../lib/getInput';
import { stringToLines } from '../lib/ts-it/lines';

const input = getInput(8, 2020);
const lines = stringToLines(input);

let com = {
  jmp: (acc, i, arg) => [acc, i + arg],
  nop: (acc, i, arg) => [acc, i + 1],
  acc: (acc, i, arg) => [acc + arg, i + 1],
};

let i = 0;
let acc = 0;
let visited = new Set<number>();
while (!visited.has(i)) {
  visited.add(i);
  const line = lines[i];
  let [, command, ammount] = line.match(/(\w+) (.*)/)!;
  [acc, i] = com[command](acc, i, +ammount);
}
console.log(acc);

function checkI(indexToReplace: number) {
  let acc = 0;
  let i = 0;
  let visited = new Set<number>();
  while (!visited.has(i)) {
    visited.add(i);
    const line = lines[i];
    if (!line) return acc;
    let [, command, ammount] = line.match(/(\w+) (.*)/)!;

    if (i === indexToReplace && command === 'nop') {
      command = 'jmp';
    } else if (i === indexToReplace && command === 'jmp') {
      command = 'nop';
    }

    [acc, i] = com[command](acc, i, +ammount);
  }
}

for (let i of range(0, lines.length)) {
  const result = checkI(i);
  if (result) console.log(result);
}
