import {
  dirIndexByName,
  fourDirectionOffsets,
  move,
  turnLeft,
  turnRight,
} from '../lib/directions';
import getInput from '../lib/getInput';
import { Vector } from '../lib/InfiniteGrid';
import { IntCodeComputer } from '../lib/intCode';
import { cross } from '../lib/ts-it/cross';
import { findOrFail } from '../lib/ts-it/find';
import { numbers } from '../lib/ts-it/numbers';
import { p } from '../lib/ts-it/pipe';
import { range } from '../lib/ts-it/range';

const input = getInput(17, 2019);

let s = '';
let c = new IntCodeComputer(numbers(input), o => (s += String.fromCharCode(o)));
c.run();
let grid = s.split('\n');

let intersectionCount = 0;
for (let y of range(0, grid.length)) {
  for (let x of range(0, grid[0].length)) {
    let neighbours = fourDirectionOffsets.map(([a, b]) => [x - a, y - b]);
    if (neighbours.every(([x, y]) => grid[y]?.[x] === '#'))
      intersectionCount += x * y;
  }
}
console.log(intersectionCount);

let pos: Vector = p(cross(range(0, grid[0].length), range(0, grid.length)))(
  findOrFail(([x, y]) => grid[y][x] === '^'),
);
let dirIndex = dirIndexByName.up;

let path = '';
let counter = 0;
while (true) {
  if (shouldTurnLeft()) {
    dirIndex = turnLeft(dirIndex);
    path += 'L';
    counter = 0;
    moveToEnd();
    path += counter;
  } else if (shouldTurnRight()) {
    dirIndex = turnRight(dirIndex);
    path += 'R';
    counter = 0;
    moveToEnd();
    path += counter;
  } else {
    break;
  }
}
console.log(path);

let finalPath =
  'L,4,R,8,L,6,L,10,L,6,R,8,R,10,L,6,L,6,L,4,R,8,L,6,L,10,L,6,R,8,R,10,L,6,L,6,L,4,L,4,L,10,L,4,L,4,L,10,L,6,R,8,R,10,L,6,L,6,L,4,R,8,L,6,L,10,L,6,R,8,R,10,L,6,L,6,L,4,L,4,L,10';
let commandA = 'L,4,R,8,L,6,L,10\n';
let commandB = 'L,4,L,4,L,10\n';
let commandC = 'L,6,R,8,R,10,L,6,L,6\n';
let mainRoutine = 'A,C,A,C,B,B,C,A,C,B\n';

let newInputs = numbers(input);
newInputs[0] = 2;

let x = 0;
let newComputer = new IntCodeComputer(newInputs, o => (x = o));

for (let c of mainRoutine) newComputer.addInput(c.charCodeAt(0));
for (let c of commandA) newComputer.addInput(c.charCodeAt(0));
for (let c of commandB) newComputer.addInput(c.charCodeAt(0));
for (let c of commandC) newComputer.addInput(c.charCodeAt(0));

newComputer.addInput('y'.charCodeAt(0));
newComputer.addInput('\n'.charCodeAt(0));

newComputer.run();
console.log(x);

function moveToEnd() {
  while (canMove(dirIndex)) {
    counter++;
    pos = move(pos, fourDirectionOffsets[dirIndex]);
  }
}

function canMove(dirIndex: number) {
  let [newX, newY] = move(pos, fourDirectionOffsets[dirIndex]);
  if (grid[newY]?.[newX] === '#') return true;
  return false;
}

function shouldTurnLeft() {
  return canMove(turnLeft(dirIndex));
}
function shouldTurnRight() {
  return canMove(turnRight(dirIndex));
}
