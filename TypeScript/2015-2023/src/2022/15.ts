import getInput from '../lib/getInput';
import { InfiniteGrid } from '../lib/InfiniteGrid';
import { Vector2D } from '../lib/math/vectors';
import { stringToLines } from '../lib/ts-it/lines';
import { numbers } from '../lib/ts-it/numbers';

const input = getInput(15, 2022);
const nums = numbers(input);
const grid = new InfiniteGrid<string, string>(() => '.');
const lines = stringToLines(input);

const sensors = lines.map((l) => {
  const [sx, sy, bx, by] = numbers(l);
  return {
    sensor: [sx, sy] as Vector2D,
    beacon: [bx, by] as Vector2D,
    dist: Math.abs(sx - bx) + Math.abs(sy - by),
  };
});

for (const s of sensors) {
  grid.set([s.sensor[0] - s.dist, s.sensor[1]], '.');
  grid.set([s.sensor[0] + s.dist, s.sensor[1]], '.');
  grid.set([s.sensor[0], s.sensor[1] - s.dist], '.');
  grid.set([s.sensor[0], s.sensor[1] + s.dist], '.');
}

for (const s of sensors) {
  grid.set(s.sensor, 'S');
  grid.set(s.beacon, 'B');
}

let part1 = 0;
const y = 2000000;
for (let x = grid.minX; x <= grid.maxX; ) {
  const sensorsThatCoverThis = sensors.filter(
    (s) => Math.abs(x - s.sensor[0]) + Math.abs(y - s.sensor[1]) <= s.dist,
  );

  let nextX = x + 1;

  if (sensorsThatCoverThis.length > 0 && grid.get([x, y]) === '.') {
    grid.set([x, y], '#');

    for (const s of sensorsThatCoverThis) {
      const maxPossibleX = s.dist - Math.abs(s.sensor[1] - y);
      nextX = Math.max(nextX, s.sensor[0] + maxPossibleX);
    }

    part1 += nextX - x;
  }

  x = nextX;
}

console.log(part1);

let minX = 0;
let minY = 0;
let maxX = 4000000;
const maxY = 4000000;

for (let y = minY; y <= maxY; y++) {
  for (let x = minX; x <= maxX; ) {
    const sensorsThatCoverThis = sensors.filter(
      (s) => Math.abs(x - s.sensor[0]) + Math.abs(y - s.sensor[1]) <= s.dist,
    );

    let nextX = x + 1;

    if (sensorsThatCoverThis.length > 0) {
      for (const s of sensorsThatCoverThis) {
        const maxPossibleX = s.dist - Math.abs(s.sensor[1] - y);
        nextX = Math.max(nextX, s.sensor[0] + maxPossibleX);
      }
    } else if (grid.get([x, y]) === '.') {
      console.log(x * 4000000 + y);
    }

    x = nextX;
  }
}
