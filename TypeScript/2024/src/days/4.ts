import { readFile } from "fs/promises";

const inp = await readFile("4.txt", "utf8").then((x) => x.slice(0, -1));
const grid = inp.trim().split("\n");

function check(s: string, x: number, y: number, dx: number, dy: number) {
  return s.split("").every((char, i) => {
    return grid[y + i * dy]?.[x + i * dx] === char;
  });
}

let result1 = 0;
let result2 = 0;
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    for (const [dx, dy] of [
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, -1],
      [-1, 0],
      [-1, 1],
    ]) {
      if (check("XMAS", x, y, dx, dy)) {
        result1++;
      }
    }

    for (const [dx1, dy1] of [
      [1, 1],
      [-1, -1],
    ]) {
      for (const [dx2, dy2] of [
        [1, -1],
        [-1, 1],
      ]) {
        if (check("MAS", x - dx1, y - dy1, dx1, dy1) && check("MAS", x - dx2, y - dy2, dx2, dy2)) {
          result2++;
        }
      }
    }
  }
}

console.log(result1, result2);
