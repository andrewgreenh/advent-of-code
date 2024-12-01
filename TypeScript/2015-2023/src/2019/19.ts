import getInput from '../lib/getInput';
import { InfiniteGrid, Vector } from '../lib/InfiniteGrid';
import { IntCodeComputer } from '../lib/intCode';
import { countIf } from '../lib/ts-it/countIf';
import { cross } from '../lib/ts-it/cross';
import { numbers } from '../lib/ts-it/numbers';
import { p } from '../lib/ts-it/pipe';
import { printGrid } from '../lib/ts-it/printGrid';
import { range } from '../lib/ts-it/range';

const input = getInput(19, 2019);

function gettingPulled(v: Vector) {
  let result = -1;
  let c = new IntCodeComputer(numbers(input), (o) => (result = o));
  c.addInput(v[0]);
  c.addInput(v[1]);
  c.run();
  return result === 1;
}

let grid = new InfiniteGrid<string>();

for (let [x, y] of cross(range(0, 50), range(0, 50))) {
  if (gettingPulled([x, y])) {
    grid.set([x, y], '#');
  }
}

printGrid(grid.toGrid(), '.', '');
p(grid.toGrid().flat())(
  countIf((c) => c === '#'),
  console.log,
);

let upperRight = [23, 48] as Vector;

function addLayer() {
  let newColumnIndex = upperRight[0] + 1;
  let y = upperRight[1];
  while (!gettingPulled([newColumnIndex, y])) y++;
  upperRight = [newColumnIndex, y];
  grid.set([newColumnIndex, y], '#');
}

while (true) {
  let upperLeft = [upperRight[0] - 99, upperRight[1]] as Vector;
  let lowerLeft = [upperRight[0] - 99, upperRight[1] + 99] as Vector;
  if (
    gettingPulled(upperLeft) &&
    gettingPulled(upperRight) &&
    gettingPulled(lowerLeft)
  ) {
    let targetX = upperLeft[0];
    let targetY = upperLeft[1];
    console.log(targetX * 10000 + targetY);
    break;
  }
  addLayer();
}
