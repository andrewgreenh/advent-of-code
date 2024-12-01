import getInput from '../lib/getInput';
import { stringToLines } from '../lib/ts-it/lines';

const input = getInput(2, 2021);
const lines = stringToLines(input);

let x = 0;
let y = 0;
for (const line of lines) {
  const [command, amount] = line.split(' ');
  if (command === 'forward') x += +amount;
  if (command === 'down') y += +amount;
  if (command === 'up') y -= +amount;
}
console.log(x * y);

let aim = 0;
x = 0;
y = 0;
for (const line of lines) {
  const [command, amount] = line.split(' ');
  if (command === 'forward') {
    x += +amount;
    y += aim * +amount;
  }
  if (command === 'down') aim += +amount;
  if (command === 'up') aim -= +amount;
}
console.log(x * y);
