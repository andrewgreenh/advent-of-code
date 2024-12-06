import { readFile } from "fs/promises";

const inp = await readFile("6.txt", "utf8").then((x) => x.slice(0, -1));
const grid = inp.trim().split("\n");

let initialY = grid.findIndex((row) => row.includes("^"));
let initialX = grid[initialY].indexOf("^");

let y = initialY;
let x = initialX;

const dirs = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

let dir = dirs[0];
let positions = new Set<string>();
while (true) {
  let newX = x + dir[0];
  let newY = y + dir[1];
  if (grid[newY]?.[newX] === "#") {
    dir = dirs[(dirs.indexOf(dir) + 1) % dirs.length];
  } else if (grid[newY]?.[newX] === undefined) {
    break;
  } else {
    y = newY;
    x = newX;
    positions.add([x, y].join(","));
  }
}
console.log(positions.size);

let result2 = 0;
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[0]!.length; x++) {
    if (y === initialY && x === initialX) continue;
    if (hasLoop(grid, x, y)) {
      result2++;
    }
  }
}

console.log(result2);

function hasLoop(grid: string[], x: number, y: number) {
  let guardX = initialX;
  let guardY = initialY;

  let dir = dirs[0];
  let positions = new Set<string>();
  let history = new Set<string>();
  if (x === 3 && y === 6) debugger;
  while (true) {
    let newX = guardX + dir[0];
    let newY = guardY + dir[1];
    if (grid[newY]?.[newX] === "#" || (newX === x && newY === y)) {
      dir = dirs[(dirs.indexOf(dir) + 1) % dirs.length];
    } else if (grid[newY]?.[newX] === undefined) {
      return false;
    } else {
      guardY = newY;
      guardX = newX;
      const key = [...dir, guardX, guardY].join(",");
      if (history.has(key)) return true;
      history.add(key);
      positions.add([guardX, guardY].join(","));
    }
  }
}
