import { readFile } from "fs/promises";

const inp = await readFile("4.txt", "utf8").then((x) => x.slice(0, -1));
const grid = inp.split("\n").map((x) => x.split(""));

const canAccess = (x: number, y: number) => {
  let c = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      if (grid[y + dy]?.[x + dx] === "@") c++;
    }
  }

  return c < 4;
};

let result1 = 0;
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] !== "@") continue;
    if (canAccess(x, y)) result1++;
  }
}

console.log(result1);

let result2 = 0;
let removed = true;
while (removed) {
  removed = false;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] !== "@") continue;
      if (canAccess(x, y)) {
        result2++;
        grid[y][x] = ".";
        removed = true;
      }
    }
  }
}

console.log(result2);
