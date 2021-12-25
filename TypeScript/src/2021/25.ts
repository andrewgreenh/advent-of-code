import getInput from '../lib/getInput';
import { stringToLines } from '../lib/ts-it/lines';
import { isTruthy } from '../lib/utils';

const input = getInput(25, 2021);
let lines = stringToLines(input).map((x) => x.split(''));
let grid: (Cucumber | null)[][] = [];
class Cucumber {
  constructor(private pos: [number, number], private dir: [number, number]) {}

  nextPos(): [number, number] {
    const x = (this.pos[0] + this.dir[0]) % grid[0].length;
    const y = (this.pos[1] + this.dir[1]) % grid.length;
    return [x, y];
  }

  canMove() {
    const [x, y] = this.nextPos();
    return !grid[y][x];
  }

  move() {
    const [x, y] = this.nextPos();
    grid[y][x] = this;
    grid[this.pos[1]][this.pos[0]] = null;
    this.pos[0] = x;
    this.pos[1] = y;
  }

  isHorizontal() {
    return this.dir[0] === 1;
  }

  toString() {
    if (this.isHorizontal()) return '>';
    return 'v';
  }
}

lines.map((line, y) =>
  line.forEach((cell, x) => {
    if (!grid[y]) grid[y] = [];
    if (cell === '.') grid[y][x] = null;
    if (cell === '>') grid[y][x] = new Cucumber([x, y], [1, 0]);
    if (cell === 'v') grid[y][x] = new Cucumber([x, y], [0, 1]);
  }),
);
const cucumbers = grid.flat().filter(isTruthy);
const horizontal = cucumbers.filter((c) => c.isHorizontal());
const vertical = cucumbers.filter((c) => !c.isHorizontal());

let i = 0;
let moved = new Set<Cucumber>();
do {
  moved.clear();

  for (const c of horizontal) c.canMove() && moved.add(c);
  for (const c of moved) c.move();

  for (const c of vertical) c.canMove() && moved.add(c);
  for (const c of moved) !c.isHorizontal() && c.move();

  i++;
} while (moved.size > 0);
console.log(i);
