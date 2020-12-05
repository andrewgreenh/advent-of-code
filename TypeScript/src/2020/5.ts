import { difference, range } from 'lodash';
import getInput from '../lib/getInput';
import { iter } from '../lib/ts-it/iter';
import { IterableValue } from '../lib/ts-it/IterableValue';
import { join } from '../lib/ts-it/join';
import { stringToLines } from '../lib/ts-it/lines';
import { map } from '../lib/ts-it/map';
import { max } from '../lib/ts-it/max';
import { min } from '../lib/ts-it/min';
import { pipe } from '../lib/ts-it/pipe';
import { startWith } from '../lib/ts-it/startWith';
import { toArray } from '../lib/ts-it/toArray';
import { toGrid } from '../lib/ts-it/toGrid';
import { transpose } from '../lib/ts-it/transpose';

const input = getInput(5, 2020);
const ids = stringToLines(input).map((l) =>
  parseInt(l.replace(/L|F/g, '0').replace(/B|R/g, '1'), 2),
);
console.log(max(ids));
console.log(difference(range(min(ids), max(ids)), ids)[0]);

// animate();

function tick(ms = 1) {
  if (ms === 0) return;
  return new Promise((r) => setTimeout(r, ms));
}

async function animate() {
  let grid = pipe(Array(128 * 9).fill('.'))(toGrid(9));
  for (let r of range(0, 128)) grid[r][4] = ' ';

  function print() {
    console.log(
      pipe(transpose(grid))(
        map((line) =>
          pipe(line)(
            map((x) => (x === undefined ? '' : x)),
            join(''),
          ),
        ),
        join('\n'),
      ) + '\n\n\n',
    );
  }

  const yToCol = (y) => {
    return y >= 4 ? y + 1 : y;
  };

  const limit = 8;

  const lineIterator = iter(lines);

  function* getWorker() {
    while (true) {
      const nextResult = lineIterator.next();
      if (nextResult.done) return;
      yield* doLine(nextResult.value);
    }
  }

  const workers = pipe(range(0, limit))(
    map((i) => {
      const worker = getWorker();
      type R = IterableValue<typeof worker>;
      const dummyValues = Array(i * 20)
        .fill('_')
        .map((): R => ['temp', 0, 4]);
      const workerWithInitialDelay = startWith<R>(dummyValues)(worker);
      return workerWithInitialDelay;
    }),
    toArray,
  );

  while (true) {
    const coords = workers
      .map((w) => w.next())
      .filter(
        (v): v is IteratorYieldResult<IterableValue<typeof workers[number]>> =>
          !v.done,
      )
      .map((v) => v.value);
    if (coords.length === 0) break;
    const tempCoords = coords.filter((c) => c[0] === 'temp');
    const finalCoords = coords.filter((c) => c[0] === 'final');

    for (const [, x, y] of finalCoords) {
      grid[x][y] = '#';
    }

    let undos = [] as (readonly [any, number, number])[];
    for (const [, x, y] of tempCoords) {
      if (grid[x][y] === '#') continue;
      const undo = [grid[x][y], x, y] as const;
      undos.push(undo);
      grid[x][y] = '#';
    }

    print();

    for (const [char, x, y] of undos) {
      grid[x][y] = char;
    }
    await tick();
  }

  print();

  function* doLine(line: string) {
    const topDown = [...line.slice(0, 7)];
    const leftRight = [...line.slice(7)];

    let x = 0;
    let y = 4;

    let minX = 0;
    let maxX = 128;
    let halfX = Math.floor((minX + maxX) / 2);

    while (true) {
      for (let row of range(x, halfX, halfX - x > 0 ? 1 : -1)) {
        yield ['temp' as 'temp' | 'final', row, y] as const;
      }
      x = halfX;

      const char = topDown.shift();
      if (char === 'F') maxX = halfX;
      else if (char === 'B') minX = halfX;
      else break;
      halfX = Math.floor((minX + maxX) / 2);
    }
    x = minX;

    let minY = 0;
    let maxY = 8;
    let halfY = Math.floor((minY + maxY) / 2);

    while (halfY !== minY) {
      for (let col of range(y, halfY, halfY - y > 0 ? 1 : -1)) {
        yield ['temp' as 'temp' | 'final', x, col] as const;
        yield ['temp' as 'temp' | 'final', x, yToCol(col)] as const;
      }
      y = halfY;

      const char = leftRight.shift();
      if (char === 'L') maxY = halfY;
      else if (char === 'R') minY = halfY;
      else break;
      halfY = Math.floor((minY + maxY) / 2);
    }
    y = minY;

    yield ['final' as 'temp' | 'final', x, yToCol(y)] as const;
  }
}
