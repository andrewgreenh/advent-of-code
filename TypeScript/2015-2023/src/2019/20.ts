import getInput from '../lib/getInput';
import { LazyGraph } from '../lib/lazy-graph/LazyGraph';
import { floor } from '../lib/math/floor';
import { drop } from '../lib/ts-it/drop';
import { enumerate } from '../lib/ts-it/enumerate';
import { map } from '../lib/ts-it/map';
import { toPairs } from '../lib/ts-it/pairs';
import { pipe } from '../lib/ts-it/pipe';
import { range } from '../lib/ts-it/range';
import { sumBy } from '../lib/ts-it/sumBy';
import { takeWhile } from '../lib/ts-it/takeWhile';
import { toArray } from '../lib/ts-it/toArray';

const input = getInput(20, 2019, true);
const lines = input.split('\n');

const isLetter = (x?: string) => x?.match(/[A-Z]/);

const portalsByCoords: ObjectOf<string> = {};
const levelDeltaByCoords: ObjectOf<number> = {};

for (const [y, line] of enumerate(lines)) {
  for (const [x, char] of enumerate(line)) {
    if (isLetter(char)) {
      if (isLetter(lines[y]?.[x + 1]) && lines[y]?.[x + 2] === '.') {
        portalsByCoords[`${x + 2}-${y}`] = char + lines[y][x + 1];
      }

      if (isLetter(lines[y + 1]?.[x]) && lines[y + 2]?.[x] === '.') {
        portalsByCoords[`${x}-${y + 2}`] = char + lines[y + 1][x];
      }

      if (isLetter(lines[y]?.[x - 1]) && lines[y]?.[x - 2] === '.') {
        portalsByCoords[`${x - 2}-${y}`] = lines[y][x - 1] + char;
      }

      if (isLetter(lines[y - 1]?.[x]) && lines[y - 2]?.[x] === '.') {
        portalsByCoords[`${x}-${y - 2}`] = lines[y - 1][x] + char;
      }
    }
  }
}

const coordsByPortal: ObjectOf<Tuple[]> = {};

for (const [key, value] of toPairs(portalsByCoords)) {
  if (!coordsByPortal[value]) coordsByPortal[value] = [];
  coordsByPortal[value].push(key.split('-').map(Number));
}

type Tuple = [number, number];

const graph = new LazyGraph<Tuple>({
  getNeighbours([x, y]) {
    const top: Tuple = [x, y - 1];
    const right: Tuple = [x + 1, y];
    const bottom: Tuple = [x, y + 1];
    const left: Tuple = [x - 1, y];
    const coords = [top, right, bottom, left].filter(
      ([x, y]) => lines[y]?.[x] === '.',
    );
    const portal = portalsByCoords[`${x}-${y}`];
    const targets = coordsByPortal[portal] ?? [];
    const target = targets.find(([tx, ty]) => tx !== x && ty !== y);
    if (target) coords.push(target);
    return coords;
  },
});

const start = coordsByPortal['AA'][0];
const end = coordsByPortal['ZZ'][0];

const path = graph.findPath({
  startNode: start,
  isEnd: (d) => d[0] === end[0] && d[1] === end[1],
});

console.log(path.isSuccess() && path.cost);
const exampleRow = lines[floor(lines.length / 2)];
const exampleColumn = pipe(range(0))(
  map((y) => lines[y]?.[floor(lines[0].length / 2)]),
  takeWhile((x) => x !== undefined),
  toArray,
  (x) => x.join(''),
);

const startX1 = 2;
const endX1 = pipe(exampleRow)(
  drop(startX1),
  takeWhile((x) => x === '.' || x === '#'),
  sumBy((x) => 1),
  (x) => x + startX1 - 1,
);
const startX2 = pipe(exampleRow)(
  drop(endX1 + 1),
  takeWhile((x) => x !== '.' && x !== '#'),
  sumBy((x) => 1),
  (x) => x + endX1 + 1,
);
const endX2 = pipe(exampleRow)(
  drop(startX2),
  takeWhile((x) => x === '.' || x === '#'),
  sumBy((x) => 1),
  (x) => x + startX2 - 1,
);

const startY1 = 2;
const endY1 = pipe(exampleColumn)(
  drop(startY1),
  takeWhile((x) => x === '.' || x === '#'),
  sumBy((x) => 1),
  (x) => x + startY1 - 1,
);
const startY2 = pipe(exampleColumn)(
  drop(endY1 + 1),
  takeWhile((x) => x !== '.' && x !== '#'),
  sumBy((x) => 1),
  (x) => x + endY1 + 1,
);
const endY2 = pipe(exampleColumn)(
  drop(startY2),
  takeWhile((x) => x === '.' || x === '#'),
  sumBy((x) => 1),
  (x) => x + startY2 - 1,
);

type Tuple3D = [number, number, number];

const recursiveGraph = new LazyGraph<Tuple3D>({
  getNeighbours([x, y, level]) {
    const top: Tuple3D = [x, y - 1, level];
    const right: Tuple3D = [x + 1, y, level];
    const bottom: Tuple3D = [x, y + 1, level];
    const left: Tuple3D = [x - 1, y, level];
    const coords = [top, right, bottom, left].filter(
      ([x, y]) => lines[y]?.[x] === '.',
    );
    const portal = portalsByCoords[`${x}-${y}`];
    const targets = coordsByPortal[portal] ?? [];
    const target = targets.find(([tx, ty]) => tx !== x && ty !== y);

    if (target) {
      const [tx, ty] = target;
      const newLevel =
        tx === startX1 || tx === endX2 || ty === startY1 || ty === endY2
          ? level + 1
          : level - 1;
      if (newLevel >= 0) {
        coords.push([tx, ty, newLevel]);
      }
    }
    return coords;
  },
});

const start2: Tuple3D = [...start, 0];
const end2: Tuple3D = [...end, 0];

const path2 = recursiveGraph.findPath({
  startNode: start2,
  isEnd: (d) => d[0] === end2[0] && d[1] === end2[1] && d[2] === end2[2],
});

console.log(path2.isSuccess() && path2.cost);
