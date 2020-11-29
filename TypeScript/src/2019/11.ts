import { Deque } from '../lib/Deque';
import getInput from '../lib/getInput';
import { InfiniteGrid, Vector } from '../lib/InfiniteGrid';
import { IntCodeComputer } from '../lib/intCode';
import { str } from '../lib/str';
import { numbers } from '../lib/ts-it/numbers';
import { printGrid } from '../lib/ts-it/printGrid';

const input = getInput(11, 2019);
const ins = numbers(input);

let grid = new InfiniteGrid<number, number>(() => 0);
let pos: Vector = [0, 0];
let dirs = new Deque([0, -1], [1, 0], [0, 1], [-1, 0]);
let expectPaint = true;
let history = new Set<string>();
let c = new IntCodeComputer([...ins], (n) => {
  if (expectPaint) {
    grid.set(pos, n);
    history.add(str(pos));
  } else {
    dirs.rotate(n === 1 ? -1 : 1);
    pos[0] += dirs.peek()![0];
    pos[1] += dirs.peek()![1];
    c.addInput(grid.get(pos));
  }
  expectPaint = !expectPaint;
});
c.addInput(grid.get(pos));
c.run();
console.log(history.size);

grid = new InfiniteGrid<number, number>(() => 0);
pos = [0, 0];
dirs = new Deque([0, -1], [1, 0], [0, 1], [-1, 0]);
expectPaint = true;
grid.set(pos, 1);
c = new IntCodeComputer([...ins], (n) => {
  if (expectPaint) {
    grid.set(pos, n);
  } else {
    dirs.rotate(n === 1 ? -1 : 1);
    pos[0] += dirs.peek()![0];
    pos[1] += dirs.peek()![1];
    c.addInput(grid.get(pos));
  }
  expectPaint = !expectPaint;
});
c.addInput(grid.get(pos));
c.run();
printGrid(grid.toGrid(), ' ', '', (x) => (x === 1 ? '#' : ' '));
