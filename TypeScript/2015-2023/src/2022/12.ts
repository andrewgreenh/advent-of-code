import { fourDirectionOffsets } from '../lib/directions';
import getInput from '../lib/getInput';
import { LazyGraph } from '../lib/lazy-graph/LazyGraph';
import { Vector2D } from '../lib/math/vectors';

const grid = getInput(12, 2022)
  .split('\n')
  .map((row) => row.split(''));

let start!: Vector2D;
let end!: Vector2D;
grid.forEach((row, y) =>
  row.forEach((c, x) => {
    if (c === 'S') {
      grid[y][x] = 'a';
      start = [x, y];
    }
    if (c === 'E') {
      grid[y][x] = 'z';
      end = [x, y];
    }
  }),
);

const graph = new LazyGraph<Vector2D>({
  getNeighbours: ([x, y]) =>
    fourDirectionOffsets
      .map(([dx, dy]): Vector2D => [x + dx, y + dy])
      .filter(
        ([nx, ny]) =>
          !!grid[ny]?.[nx] &&
          grid[ny][nx].charCodeAt(0) - grid[y][x].charCodeAt(0) <= 1,
      ),
});

const goal = graph
  .findPath({
    startNode: start,
    isEnd: ([x, y]) => x === end[0] && y === end[1],
  })
  .force();

console.log(goal.cost);

const graph2 = new LazyGraph<Vector2D>({
  getNeighbours: ([x, y]) =>
    fourDirectionOffsets
      .map(([dx, dy]): Vector2D => [x + dx, y + dy])
      .filter(
        ([nx, ny]) =>
          !!grid[ny]?.[nx] &&
          grid[y][x].charCodeAt(0) - grid[ny][nx].charCodeAt(0) <= 1,
      ),
});

const goal2 = graph2
  .findPath({
    startNode: end,
    isEnd: ([x, y]) => grid[y][x] === 'a',
  })
  .force();
console.log(goal2.cost);
