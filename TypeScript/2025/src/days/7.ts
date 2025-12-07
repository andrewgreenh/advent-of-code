import { readFile, writeFile } from "fs/promises";

const inp = await readFile("7.txt", "utf8").then((x) => x.slice(0, -1));
const grid = inp.split("\n").map((x) => x.split(""));

let splitCount = 0;
for (let y = 1; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    const hasBeem = grid[y - 1][x] === "S" || grid[y - 1][x] === "|";
    const shouldSplit = grid[y][x] === "^";

    if (hasBeem && shouldSplit) {
      splitCount++;
      grid[y][x - 1] = "|";
      grid[y][x + 1] = "|";
    } else if (hasBeem) {
      grid[y][x] = "|";
    }
  }
}
console.log(splitCount);

await writeFile("7_output.txt", grid.map((x) => x.join("")).join("\n"));

let cache = new Map<string, number>();
function countPaths(x: number, y: number): number {
  const key = `${x},${y}`;
  if (cache.has(key)) return cache.get(key)!;
  let result;
  if (y === grid.length - 1) result = 1;
  else if (grid[y][x] === "^") {
    result = countPaths(x - 1, y + 1) + countPaths(x + 1, y + 1);
  } else {
    result = countPaths(x, y + 1);
  }
  cache.set(key, result);
  return result;
}

console.log(countPaths(grid[0].indexOf("S"), 0));
