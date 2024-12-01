import { fourDirectionOffsets } from '../lib/directions';
import getInput from '../lib/getInput';
import { LazyGraph } from '../lib/lazy-graph/LazyGraph';
import { countIf } from '../lib/ts-it/countIf';
import { cross } from '../lib/ts-it/cross';
import { filter } from '../lib/ts-it/filter';
import { stringToLines } from '../lib/ts-it/lines';
import { map } from '../lib/ts-it/map';
import { p } from '../lib/ts-it/pipe';
import { range } from '../lib/ts-it/range';
import { sumBy } from '../lib/ts-it/sumBy';
import { toArray } from '../lib/ts-it/toArray';
import { isTruthy } from '../lib/utils';

const input = getInput(18, 2019);
const grid = [...p(input)(stringToLines)];

let keyCount = p(cross(range(0, grid[0].length), range(0, grid.length)))(
  countIf(([x, y]) => !!grid[y]?.[x]?.match(/[a-z]/)),
);

type Node = {
  x: number;
  y: number;
  keys: string;
};

let i = 0;
let graph = new LazyGraph<Node>({
  hashData: (d) => [d.x, d.y, d.keys].join('-'),
  getNeighbourCost: () => 1,
  getNeighbours: (d) => {
    i++;
    if (i % 100000 === 0) {
      console.log(d);
    }
    let neighbours: Node[] = [];
    for (let [dx, dy] of fourDirectionOffsets) {
      let nx = d.x + dx;
      let ny = d.y + dy;
      let c = grid[ny]?.[nx];
      if (!c) continue;
      if (c === '#') {
        continue;
      }
      if (c === '.') {
        neighbours.push({
          x: nx,
          y: ny,
          keys: d.keys,
        });
      }
      if (c.match(/[a-z]/)) {
        neighbours.push({
          x: nx,
          y: ny,
          keys: d.keys.includes(c) ? d.keys : [...(d.keys + c)].sort().join(''),
        });
      }
      if (c.match(/[A-Z]/) && d.keys.includes(c.toLowerCase())) {
        neighbours.push({
          x: nx,
          y: ny,
          keys: d.keys,
        });
      }
    }
    return neighbours;
  },
});

const upperLeftKeys = p(cross(range(0, grid[0].length), range(0, grid.length)))(
  filter(([x, y]) => x < 40 && y < 40),
  map(([x, y]) => (grid[y][x].match(/[a-z]/) ? grid[y][x] : null)),
  toArray,
  (x) => x.filter(isTruthy),
);
const upperRightKeys = p(
  cross(range(0, grid[0].length), range(0, grid.length)),
)(
  filter(([x, y]) => x > 40 && y < 40),
  map(([x, y]) => (grid[y][x].match(/[a-z]/) ? grid[y][x] : null)),
  toArray,
  (x) => x.filter(isTruthy),
);
const lowerLeftKeys = p(cross(range(0, grid[0].length), range(0, grid.length)))(
  filter(([x, y]) => x < 40 && y > 40),
  map(([x, y]) => (grid[y][x].match(/[a-z]/) ? grid[y][x] : null)),
  toArray,
  (x) => x.filter(isTruthy),
);
const lowerRightKeys = p(
  cross(range(0, grid[0].length), range(0, grid.length)),
)(
  filter(([x, y]) => x > 40 && y > 40),
  map(([x, y]) => (grid[y][x].match(/[a-z]/) ? grid[y][x] : null)),
  toArray,
  (x) => x.filter(isTruthy),
);

let upperLeft = graph.findPath({
  startNode: {
    keys: [...upperRightKeys, ...lowerLeftKeys, ...lowerRightKeys].join(''),
    x: 39,
    y: 39,
  },
  isEnd: (d) => d.keys.length === keyCount,
});

let upperRight = graph.findPath({
  startNode: {
    keys: [...upperLeftKeys, ...lowerLeftKeys, ...lowerRightKeys].join(''),
    x: 41,
    y: 39,
  },
  isEnd: (d) => d.keys.length === keyCount,
});
let lowerLeft = graph.findPath({
  startNode: {
    keys: [...upperLeftKeys, ...upperRightKeys, ...lowerRightKeys].join(''),
    x: 39,
    y: 41,
  },
  isEnd: (d) => d.keys.length === keyCount,
});
let lowerRight = graph.findPath({
  startNode: {
    keys: [...upperLeftKeys, ...upperRightKeys, ...lowerLeftKeys].join(''),
    x: 41,
    y: 41,
  },
  isEnd: (d) => d.keys.length === keyCount,
});

p([upperLeft, upperRight, lowerLeft, lowerRight])(
  sumBy((x: any) => x.cost),
  console.log,
);
