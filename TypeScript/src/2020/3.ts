import getInput from '../lib/getInput';

const input = getInput(3, 2020).split('\n');

const width = input[0].length;

function run(dx: number, dy: number) {
  let x = 0;
  let y = 0;
  let c = 0;
  while (y < input.length) {
    if (input[y][x] === '#') c++;
    x = (x + dx) % width;
    y = y + dy;
  }
  return c;
}

console.log(run(3, 1));
console.log(run(1, 1) * run(3, 1) * run(5, 1) * run(7, 1) * run(1, 2));
