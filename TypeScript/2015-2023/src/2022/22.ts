import assert from 'assert';
import { findIndex, findLastIndex, range } from 'lodash';
import getInput from '../lib/getInput';
import { Vector2D } from '../lib/math/vectors';

const input = getInput(22, 2022, true).trimEnd();
const [mapString, commandString] = input.split('\n\n');
const commands = commandString
  .replaceAll(/([LR])/g, ' $1 ')
  .split(' ')
  .map((c) => ('RL'.includes(c) ? c : +c));

const map = mapString.split('\n').map((row) => row.split(''));

const dirs = {
  right: [1, 0],
  down: [0, 1],
  left: [-1, 0],
  up: [0, -1],
} satisfies Record<string, Vector2D>;
const dirList = Object.values(dirs);

let dir = dirs.right;
let pos: Vector2D = [map[0].indexOf('.'), 0];

for (const c of commands) {
  if (c === 'R') dir = dirList[turnRight(dirList.indexOf(dir))];
  if (c === 'L') dir = dirList[turnLeft(dirList.indexOf(dir))];
  if (typeof c === 'number') {
    for (let i = 0; i < c; i++) {
      const newPos = movePlane(pos, dir);
      if (vEquals(pos, newPos)) {
        break;
      }
      pos = newPos;
    }
  }
}

console.log(1000 * (pos[1] + 1) + 4 * (pos[0] + 1) + dirList.indexOf(dir));

dir = dirs.right;
pos = [map[0].indexOf('.'), 0];

let counter = 0;
const cube = range(0, 5).map((y) =>
  range(0, 5).map((x) =>
    map[y * 50]?.[x * 50] === '#' || map[y * 50]?.[x * 50] === '.'
      ? counter++
      : ' ',
  ),
);

for (const c of commands) {
  if (c === 'R') dir = dirList[turnRight(dirList.indexOf(dir))];
  if (c === 'L') dir = dirList[turnLeft(dirList.indexOf(dir))];
  if (typeof c === 'number') {
    for (let i = 0; i < c; i++) {
      const { dir: newDir, pos: newPos } = moveCube(pos, dir);
      if (vEquals(newDir, dir) && vEquals(pos, newPos)) {
        break;
      }
      pos = newPos;
      dir = newDir;
    }
  }
}

console.log(1000 * (pos[1] + 1) + 4 * (pos[0] + 1) + dirList.indexOf(dir));

function turnLeft(dirIndex: number) {
  return (dirIndex + 3) % 4;
}
function turnRight(dirIndex: number) {
  return (dirIndex + 1) % 4;
}

function movePlane(pos: Vector2D, dir: Vector2D): Vector2D {
  const [x, y] = pos;
  const [dx, dy] = dir;

  const nx = x + dx;
  const ny = y + dy;
  if (map[ny]?.[nx] === '#') return pos;
  if (map[ny]?.[nx] === '.') return [nx, ny];

  if (dir === dirs.right) {
    const firstCharIndex = map[y].findIndex((c) => c === '.' || c === '#');
    if (map[y][firstCharIndex] === '.') return [firstCharIndex, y];
    if (map[y][firstCharIndex] === '#') return [x, y];
    throw new Error('should never happen');
  }
  if (dir === dirs.left) {
    const lastCharIndex = findLastIndex(map[y], (c) => c === '.' || c === '#');
    if (map[y][lastCharIndex] === '.') return [lastCharIndex, y];
    if (map[y][lastCharIndex] === '#') return [x, y];
    throw new Error('should never happen');
  }
  if (dir === dirs.down) {
    const firstCharIndex = map.findIndex(
      (row) => row[x] === '.' || row[x] === '#',
    );
    if (map[firstCharIndex][x] === '.') return [x, firstCharIndex];
    if (map[firstCharIndex][x] === '#') return [x, y];
    throw new Error('should never happen');
  }
  if (dir === dirs.up) {
    const lastCharIndex = findLastIndex(
      map,
      (row) => row[x] === '.' || row[x] === '#',
    );
    if (map[lastCharIndex][x] === '.') return [x, lastCharIndex];
    if (map[lastCharIndex][x] === '#') return [x, y];
    throw new Error('should never happen');
  }

  throw new Error('should never happen');
}

function vEquals(a: Vector2D, b: Vector2D) {
  return a[0] === b[0] && a[1] === b[1];
}

function moveCube(
  pos: Vector2D,
  dir: Vector2D,
): { pos: Vector2D; dir: Vector2D } {
  const [x, y] = pos;
  const [dx, dy] = dir;

  const nx = x + dx;
  const ny = y + dy;
  if (map[ny]?.[nx] === '#') return { pos, dir };
  if (map[ny]?.[nx] === '.') return { pos: [nx, ny], dir };

  const cubeNum = cube[Math.floor(y / 50)][Math.floor(x / 50)];

  assert(typeof cubeNum === 'number');

  // right
  if (dir === dirs.right && cubeNum === 1) {
    const nextY = 149 - y;
    const nextX = findLastIndex(map[nextY], (c) => '#.'.includes(c));
    const nextCubeNum = cube[Math.floor(nextY / 50)][Math.floor(nextX / 50)];
    assert(nextCubeNum === 4);
    if (map[nextY][nextX] === '.')
      return { pos: [nextX, nextY], dir: dirs.left };
    if (map[nextY][nextX] === '#') return { pos, dir };
    throw new Error('should never happen');
  }
  if (dir === dirs.right && cubeNum === 2) {
    const nextX = y + 50;
    const nextY = findLastIndex(map, (row) => '#.'.includes(row[nextX]));
    const nextCubeNum = cube[Math.floor(nextY / 50)][Math.floor(nextX / 50)];
    assert(nextCubeNum === 1);
    if (map[nextY][nextX] === '.') return { pos: [nextX, nextY], dir: dirs.up };
    if (map[nextY][nextX] === '#') return { pos, dir };
    throw new Error('should never happen');
  }
  if (dir === dirs.right && cubeNum === 4) {
    const nextY = 149 - y;
    const nextX = findLastIndex(map[nextY], (c) => '#.'.includes(c));
    const nextCubeNum = cube[Math.floor(nextY / 50)][Math.floor(nextX / 50)];
    assert(nextCubeNum === 1);
    if (map[nextY][nextX] === '.')
      return { pos: [nextX, nextY], dir: dirs.left };
    if (map[nextY][nextX] === '#') return { pos, dir };
    throw new Error('should never happen');
  }
  if (dir === dirs.right && cubeNum === 5) {
    const nextX = y - 100;
    const nextY = findLastIndex(map, (row) => '#.'.includes(row[nextX]));
    const nextCubeNum = cube[Math.floor(nextY / 50)][Math.floor(nextX / 50)];
    assert(nextCubeNum === 4);
    if (map[nextY][nextX] === '.') return { pos: [nextX, nextY], dir: dirs.up };
    if (map[nextY][nextX] === '#') return { pos, dir };
    throw new Error('should never happen');
  }
  if (dir === dirs.right) {
    throw new Error(`Unexpected cube index with at ${x}-${y} ${cubeNum}`);
  }

  // down!
  if (dir === dirs.down && cubeNum === 5) {
    const nextX = x + 100;
    const nextY = findIndex(map, (row) => '#.'.includes(row[nextX]));
    const nextCubeNum = cube[Math.floor(nextY / 50)][Math.floor(nextX / 50)];
    assert(nextCubeNum === 1);
    if (map[nextY][nextX] === '.')
      return { pos: [nextX, nextY], dir: dirs.down };
    if (map[nextY][nextX] === '#') return { pos, dir };
    throw new Error('should never happen');
  }
  if (dir === dirs.down && cubeNum === 4) {
    const nextY = x + 100;
    const nextX = findLastIndex(map[nextY], (c) => '#.'.includes(c));
    const nextCubeNum = cube[Math.floor(nextY / 50)][Math.floor(nextX / 50)];
    assert(nextCubeNum === 5);
    if (map[nextY][nextX] === '.')
      return { pos: [nextX, nextY], dir: dirs.left };
    if (map[nextY][nextX] === '#') return { pos, dir };
    throw new Error('should never happen');
  }
  if (dir === dirs.down && cubeNum === 1) {
    const nextY = x - 50;
    const nextX = findLastIndex(map[nextY], (c) => '#.'.includes(c));
    const nextCubeNum = cube[Math.floor(nextY / 50)][Math.floor(nextX / 50)];
    assert(nextCubeNum === 2);
    if (map[nextY][nextX] === '.')
      return { pos: [nextX, nextY], dir: dirs.left };
    if (map[nextY][nextX] === '#') return { pos, dir };
    throw new Error('should never happen');
  }
  if (dir === dirs.down) {
    throw new Error(`Unexpected cube index with at ${x}-${y} ${cubeNum}`);
  }

  // left!
  if (dir === dirs.left && cubeNum === 0) {
    const nextY = 149 - y;
    const nextX = findIndex(map[nextY], (c) => '#.'.includes(c));
    const nextCubeNum = cube[Math.floor(nextY / 50)][Math.floor(nextX / 50)];
    assert(nextCubeNum === 3);
    if (map[nextY][nextX] === '.')
      return { pos: [nextX, nextY], dir: dirs.right };
    if (map[nextY][nextX] === '#') return { pos, dir };
    throw new Error('should never happen');
  }
  if (dir === dirs.left && cubeNum === 2) {
    const nextX = y - 50;
    const nextY = findIndex(map, (row) => '#.'.includes(row[nextX]));
    const nextCubeNum = cube[Math.floor(nextY / 50)][Math.floor(nextX / 50)];
    assert(nextCubeNum === 3);
    if (map[nextY][nextX] === '.')
      return { pos: [nextX, nextY], dir: dirs.down };
    if (map[nextY][nextX] === '#') return { pos, dir };
    throw new Error('should never happen');
  }
  if (dir === dirs.left && cubeNum === 3) {
    const nextY = 149 - y;
    const nextX = findIndex(map[nextY], (c) => '#.'.includes(c));
    const nextCubeNum = cube[Math.floor(nextY / 50)][Math.floor(nextX / 50)];
    assert(nextCubeNum === 0);
    if (map[nextY][nextX] === '.')
      return { pos: [nextX, nextY], dir: dirs.right };
    if (map[nextY][nextX] === '#') return { pos, dir };
    throw new Error('should never happen');
  }
  if (dir === dirs.left && cubeNum === 5) {
    const nextX = y - 100;
    const nextY = findIndex(map, (row) => '#.'.includes(row[nextX]));
    const nextCubeNum = cube[Math.floor(nextY / 50)][Math.floor(nextX / 50)];
    assert(nextCubeNum === 0);
    if (map[nextY][nextX] === '.')
      return { pos: [nextX, nextY], dir: dirs.down };
    if (map[nextY][nextX] === '#') return { pos, dir };
    throw new Error('should never happen');
  }
  if (dir === dirs.left) {
    throw new Error(`Unexpected cube index with at ${x}-${y} ${cubeNum}`);
  }

  // up!
  if (dir === dirs.up && cubeNum === 3) {
    const nextY = x + 50;
    const nextX = findIndex(map[nextY], (c) => '#.'.includes(c));
    const nextCubeNum = cube[Math.floor(nextY / 50)][Math.floor(nextX / 50)];
    assert(nextCubeNum === 2);
    if (map[nextY][nextX] === '.')
      return { pos: [nextX, nextY], dir: dirs.right };
    if (map[nextY][nextX] === '#') return { pos, dir };
    throw new Error('should never happen');
  }
  if (dir === dirs.up && cubeNum === 0) {
    const nextY = x + 100;
    const nextX = findIndex(map[nextY], (c) => '#.'.includes(c));

    const nextCubeNum = cube[Math.floor(nextY / 50)][Math.floor(nextX / 50)];
    assert(nextCubeNum === 5);
    if (map[nextY][nextX] === '.')
      return { pos: [nextX, nextY], dir: dirs.right };
    if (map[nextY][nextX] === '#') return { pos, dir };
    throw new Error('should never happen');
  }
  if (dir === dirs.up && cubeNum === 1) {
    const nextX = x - 100;
    const nextY = findLastIndex(map, (c) => '#.'.includes(c[nextX]));
    const nextCubeNum = cube[Math.floor(nextY / 50)][Math.floor(nextX / 50)];
    assert(nextCubeNum === 5);
    if (map[nextY][nextX] === '.') return { pos: [nextX, nextY], dir: dirs.up };
    if (map[nextY][nextX] === '#') return { pos, dir };
    throw new Error('should never happen');
  }
  if (dir === dirs.up) {
    throw new Error(`Unexpected cube index with at ${x}-${y} ${cubeNum}`);
  }

  throw new Error('should never happen');
}
