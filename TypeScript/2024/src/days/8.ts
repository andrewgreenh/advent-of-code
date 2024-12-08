import { readFile } from "fs/promises";

const inp = await readFile("8.txt", "utf8").then((x) => x.slice(0, -1));
const grid = inp.trim().split("\n");

const locationsByFreq = new Map<string, [number, number][]>();
const nodeLocations = new Set<string>();
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    const char = grid[y][x];
    if (char === ".") continue;
    if (!locationsByFreq.has(char)) locationsByFreq.set(char, []);
    locationsByFreq.get(char)!.push([x, y]);
  }
}

for (const freq of locationsByFreq.values()) {
  for (let i = 0; i < freq.length; i++) {
    for (let j = i + 1; j < freq.length; j++) {
      const dx = freq[i][0] - freq[j][0];
      const dy = freq[i][1] - freq[j][1];
      const x1 = freq[i][0] + dx;
      const y1 = freq[i][1] + dy;
      const x2 = freq[j][0] - dx;
      const y2 = freq[j][1] - dy;

      if (grid[y1]?.[x1] !== undefined) {
        nodeLocations.add(`${x1},${y1}`);
      }
      if (grid[y2]?.[x2] !== undefined) {
        nodeLocations.add(`${x2},${y2}`);
      }
    }
  }
}
console.log(nodeLocations.size);

for (const freq of locationsByFreq.values()) {
  for (let i = 0; i < freq.length; i++) {
    for (let j = i + 1; j < freq.length; j++) {
      const dx = freq[i][0] - freq[j][0];
      const dy = freq[i][1] - freq[j][1];
      let x = freq[i][0];
      let y = freq[i][1];
      while (grid[y]?.[x] !== undefined) {
        nodeLocations.add(`${x},${y}`);
        x += dx;
        y += dy;
      }
      x = freq[i][0];
      y = freq[i][1];
      while (grid[y]?.[x] !== undefined) {
        nodeLocations.add(`${x},${y}`);
        x -= dx;
        y -= dy;
      }
    }
  }
}
console.log(nodeLocations.size);
