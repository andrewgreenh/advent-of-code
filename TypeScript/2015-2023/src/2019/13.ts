import getInput from '../lib/getInput';
import { IntCodeComputer, IntCodeScreen } from '../lib/intCode';
import { numbers } from '../lib/ts-it/numbers';

const input = getInput(13, 2019);
const ins = numbers(input);

let p1 = 0;
let c1 = new IntCodeComputer([...ins], (x) => (p1 += x === 2 ? 1 : 0));
c1.run();

const ins2 = [...ins];
ins2[0] = 2;
let c2 = new IntCodeComputer(ins2, paint2);
let s = new IntCodeScreen();

let offset = 0;
let x = -1;
let y = -1;
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
    c2.run();
    console.log(p1);
    console.log(score);
  } catch (e) {
    s.paint(true);
    await new Promise((r) => setTimeout(r, 16));
    if (ballX > paddleX) c2.addInput(1);
    if (ballX < paddleX) c2.addInput(-1);
    if (ballX === paddleX) c2.addInput(0);
    play();
  }
}

play();
