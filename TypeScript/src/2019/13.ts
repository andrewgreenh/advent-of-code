import getInput from '../lib/getInput';
import { IntCodeComputer, IntCodeScreen } from '../lib/intCode';
import { countIf } from '../lib/ts-it/countIf';
import { flatten } from '../lib/ts-it/flatten';
import { numbers } from '../lib/ts-it/numbers';
import { p } from '../lib/ts-it/pipe';

const input = getInput(13, 2019);
const ins = numbers(input);

let c = new IntCodeComputer([...ins], paint1);

let s = new IntCodeScreen();
let offset = 0;
let x = -1;
let y = -1;
function paint1(n: number) {
  if (offset === 0) x = n;
  if (offset === 1) y = n;
  if (offset === 2) {
    if (n === 0) s.grid.set([x, y], ' ');
    if (n === 1) s.grid.set([x, y], '#');
    if (n === 2) s.grid.set([x, y], 'x');
    if (n === 3) s.grid.set([x, y], '-');
    if (n === 4) s.grid.set([x, y], 'o');
  }
  offset = (offset + 1) % 3;
}
c.run();

const part1 = p(s.grid.toGrid())(
  flatten,
  countIf(x => x === 2),
);

const ins2 = [...ins];
ins2[0] = 2;
c = new IntCodeComputer(ins2, paint2);
s.grid.clear();

offset = 0;
x = -1;
y = -1;
let score = 0;
let ballX = -1;
let paddleX = -1;
function paint2(n: number) {
  if (offset === 0) x = n;
  if (offset === 1) y = n;
  if (offset === 2) {
    if (x === -1 && y === 0) {
      const digits = n.toString().split('');
      digits.forEach((d, i) => s.grid.set([45 + i, 10], d));
      score = n;
    } else {
      if (n === 0) s.grid.set([x, y], ' ');
      if (n === 1) s.grid.set([x, y], '#');
      if (n === 2) s.grid.set([x, y], 'x');
      if (n === 3) s.grid.set([x, y], '-'), (paddleX = x);
      if (n === 4) s.grid.set([x, y], 'o'), (ballX = x);
    }
  }
  offset = (offset + 1) % 3;
}

async function play() {
  try {
    c.run();
    console.log(part1);
    console.log(score);
  } catch (e) {
    s.paint(true);
    await new Promise(r => setTimeout(r, 150));
    if (ballX > paddleX) c.addInput(1);
    if (ballX < paddleX) c.addInput(-1);
    if (ballX === paddleX) c.addInput(0);
    play();
  }
}

play();
