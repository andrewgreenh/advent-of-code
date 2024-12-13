import { readFile } from "fs/promises";

const inp = await readFile("10.txt", "utf8").then((x) => x.slice(0, -1));
const grid = inp.split("\n").map((row) => row.split("").map((x) => +x));

let result1 = 0;
let result2 = 0;
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] === 0) {
      result1 += getScore([x, y]);
      result2 += getRating([x, y]);
    }
  }
}

console.log(result1, result2);

type Vec = [number, number];

function getRating(trailhead: Vec): number {
  const trails = findTrails(trailhead);
  const nines = trails.map((trail) => trail.at(-1)!).filter(([x, y]) => grid[y][x] === 9);
  return nines.length;
}

function getScore(trailhead: Vec): number {
  const trails = findTrails(trailhead);
  const nines = trails
    .map((trail) => trail.at(-1)!)
    .filter(([x, y]) => grid[y][x] === 9)
    .map((pos) => pos.join(","));
  const set = new Set(nines);
  return set.size;
}

function findTrails(pos: Vec): Vec[][] {
  const height = grid[pos[1]][pos[0]];
  if (height === 9) return [[pos]];
  const neighbours = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];
  const neighboursWithCorrectHeight = neighbours.filter(([dx, dy]) => {
    const x = pos[0] + dx;
    const y = pos[1] + dy;
    return grid[y]?.[x] === height + 1;
  });
  if (neighboursWithCorrectHeight.length === 0) return [[pos]];
  return neighboursWithCorrectHeight.flatMap(([dx, dy]) => {
    const nextTrails = findTrails([pos[0] + dx, pos[1] + dy]);
    return nextTrails.map((trail) => [pos, ...trail] as Vec[]);
  });
}

function logTrail(trail: Vec[]) {
  console.log(trail.map((pos) => pos.join(",")).join(" -> "));
}
