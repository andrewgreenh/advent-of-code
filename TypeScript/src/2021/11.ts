import getInput from '../lib/getInput';
import { Vector } from '../lib/InfiniteGrid';
import { squareAround } from '../lib/ts-it/squareCoords';

const input = getInput(11, 2021);
const grid = input.split('\n').map((line) => line.split('').map(Number));

let flashCount = 0;

for (let i = 0; true; i++) {
  grid.forEach((row, y) => row.forEach((cell, x) => increment([x, y])));
  const currentFlashCount = flashCount;

  grid.forEach((row, y) =>
    row.forEach((cell, x) => {
      if (cell > 9) {
        flashCount++;
        grid[y][x] = 0;
      }
    }),
  );

  if (flashCount - currentFlashCount === 100) {
    console.log(i + 1);
    break;
  }
  if (i === 99) console.log(flashCount);
}

function increment([x, y]: Vector) {
  grid[x][y]++;

  if (grid[x][y] === 10) {
    for (const [nx, ny] of squareAround([x, y], 3, false)) {
      const neighbour = grid[ny]?.[nx];
      if (neighbour === undefined) continue;

      increment([nx, ny]);
    }
  }
}
