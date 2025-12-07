import { readFile } from "fs/promises";

const inp = await readFile("7.txt", "utf8").then((x) => x.slice(0, -1));
const grid = inp.split("\n").map((x) => x.split(""));

let cache = new Map<string, number>();
let splitKeys = new Set<string>();
function countPaths(x: number, y: number): number {
  const key = `${x},${y}`;
  if (cache.has(key)) return cache.get(key)!;
  let result;
  if (y === grid.length - 1) result = 1;
  else if (grid[y][x] === "^") {
    splitKeys.add(key);
    result = countPaths(x - 1, y + 1) + countPaths(x + 1, y + 1);
  } else {
    result = countPaths(x, y + 1);
  }
  cache.set(key, result);
  return result;
}

console.log(splitKeys.size, countPaths(grid[0].indexOf("S"), 0));
