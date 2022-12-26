import { findLastIndex, sum } from 'lodash';
import getInput from '../lib/getInput';
import { InfiniteGrid } from '../lib/InfiniteGrid';

const input = getInput(17, 2022).trim();

const blocks = [
  `####`,
  `.#.
###
.#.`,
  `..#
..#
###`,
  `#
#
#
#`,
  `##
##`,
].map((x) => x.split('\n').map((row) => row.split('')));

let blockIndex = 0;
let jetIndex = 0;
let grid = new InfiniteGrid<string, string>(() => '.');
for (let i = 0; i < 7; i++) {
  grid.set([i, 1], '#');
}

function nextBlock() {
  const block = blocks[blockIndex];
  blockIndex = (blockIndex + 1) % blocks.length;
  const blockWidth = block[0].length;
  let blockStartY = grid.minY - 3 - block.length;
  let blockStartX = 2;

  while (true) {
    const jet = input[jetIndex];

    jetIndex = (jetIndex + 1) % input.length;
    const d = jet === '>' ? 1 : -1;
    const hasRoomToEdge =
      jet === '>' ? blockStartX + blockWidth < 7 : blockStartX > 0;
    const canMoveSideways =
      hasRoomToEdge &&
      block.every((row, rowIndex) => {
        const indexOfFirstRock = row.indexOf('#');
        const indexOfLastRock = row.lastIndexOf('#');
        return (
          grid.peek([
            blockStartX +
              d +
              (jet === '>' ? indexOfLastRock : indexOfFirstRock),
            blockStartY + rowIndex,
          ]) !== '#'
        );
      });
    if (canMoveSideways) blockStartX += d;

    const canMoveDown = block[0].every((_, columnIndex) => {
      const indexOfLastRock = findLastIndex(
        block,
        (row) => row[columnIndex] === '#',
      );
      return (
        grid.peek([
          blockStartX + columnIndex,
          blockStartY + indexOfLastRock + 1,
        ]) !== '#'
      );
    });

    if (canMoveDown) {
      blockStartY++;
    } else {
      break;
    }
  }

  for (let y = 0; y < block.length; y++) {
    for (let x = 0; x < block[y].length; x++) {
      if (block[y][x] === '#')
        grid.set([x + blockStartX, blockStartY + y], '#');
    }
  }
}

let lastHeight = -1 * grid.minY + 1;
const history = [] as number[];
let jetIndexAtCycle = 2;
let blockIndexAtCycle = 3;
let cycleIndices = [] as number[];
for (let i = 0; i < 10000; i++) {
  const isAtCycleStart =
    jetIndexAtCycle === jetIndex && blockIndexAtCycle === blockIndex;
  if (isAtCycleStart) cycleIndices.push(i);
  nextBlock();
  const newHeight = -1 * grid.minY + 1;
  const diff = newHeight - lastHeight;

  history.push(diff);
  lastHeight = newHeight;
}

console.log(sum(history.slice(0, 2022)));

const startOfFirstCycle = cycleIndices[0];
const cycleLength = cycleIndices.at(-1)! - cycleIndices.at(-2)!;

const target = 1000000000000;
const heightBeforeFirstCycle = sum(history.slice(0, startOfFirstCycle));

const cycleHeight = sum(
  history.slice(startOfFirstCycle, startOfFirstCycle + cycleLength),
);
const cycleCount = Math.floor((target - startOfFirstCycle) / cycleLength);
const heightOfFullCycles = cycleCount * cycleHeight;
const remainder = target - startOfFirstCycle - cycleCount * cycleLength;
const heightAfterFullCycles = sum(
  history.slice(startOfFirstCycle, startOfFirstCycle + remainder),
);
console.log(
  heightBeforeFirstCycle + heightAfterFullCycles + heightOfFullCycles,
);
