import getInput from '../lib/getInput';
import { stringToLines } from '../lib/ts-it/lines';

const input = getInput(10, 2022);
const lines = stringToLines(input);

let x = 1;
let cycle = 1;
let result = 0;

let screen = '';

function tick(n: number) {
  for (let i = 0; i < n; i++) {
    let painting = (cycle - 1) % 40;
    if (painting === 0) screen += '\n';
    if (Math.abs(painting - x) <= 1) screen += '#';
    else screen += '.';
    if ((cycle - 20) % 40 === 0) {
      result += x * cycle;
      console.log(cycle, x);
    }
    cycle++;
  }
}

for (const line of lines) {
  const [cmd, num] = line.split(' ');
  if (cmd === 'noop') {
    tick(1);
  } else {
    tick(2);
    x += +num;
  }
}

console.log(result);
console.log(screen);
