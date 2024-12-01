import { cloneDeep, range } from 'lodash';
import getInput from '../lib/getInput';
import { stringToLines } from '../lib/ts-it/lines';

const input = getInput(11, 2020);
let lines = stringToLines(input);

function live(lines: string[], partTwo = false) {
  let grid = lines.map((l) => l.split(''));

  while (true) {
    let newGrid = cloneDeep(grid);

    let someChanged = false;
    for (let y of range(0, newGrid.length)) {
      for (let x of range(0, newGrid[0].length)) {
        let occ = 0;
        for (let dy of [-1, 0, 1]) {
          for (let dx of [-1, 0, 1]) {
            if (dy === 0 && dx === 0) continue;
            let cx = x;
            let cy = y;
            do {
              cx += dx;
              cy += dy;
            } while (partTwo && grid[cy]?.[cx] === '.');

            if (grid[cy]?.[cx] === '#') occ++;
          }
        }
        if (grid[y][x] === 'L' && occ === 0) {
          newGrid[y][x] = '#';
          someChanged = true;
        }
        if (grid[y][x] === '#' && occ >= (partTwo ? 5 : 4)) {
          newGrid[y][x] = 'L';
          someChanged = true;
        }
      }
    }
    if (!someChanged) break;
    grid = newGrid;
  }

  let ans = 0;
  for (let line of grid) {
    for (let c of line) {
      if (c === '#') ans++;
    }
  }
  return ans;
}
console.log(live(lines));
console.log(live(lines, true));
