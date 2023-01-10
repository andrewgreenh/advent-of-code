import getInput from '../lib/getInput';
import { Vector2D } from '../lib/math/vectors';
import { extent } from '../lib/ts-it/extent';
import { stringToLines } from '../lib/ts-it/lines';
import { map } from '../lib/ts-it/map';
import { pipe } from '../lib/ts-it/pipe';

const { stringify, parse } = JSON;

const input = getInput(23, 2022);
const elfByCoord = new Map<string, Elf>();
stringToLines(input).flatMap((row, y) =>
  row.split('').forEach((char, x) => {
    if (char === '#') elfByCoord.set(stringify([x, y]), { type: 'ELF', x, y });
  }),
);
type Elf = { type: 'ELF'; x: number; y: number };

const offsets = [
  [
    [0, -1],
    [-1, -1],
    [1, -1],
  ],
  [
    [0, 1],
    [-1, 1],
    [1, 1],
  ],
  [
    [-1, 0],
    [-1, 1],
    [-1, -1],
  ],
  [
    [1, 0],
    [1, 1],
    [1, -1],
  ],
] as Vector2D[][];

function turn() {}

for (let i = 0; true; i++) {
  const planned = new Map<string, Elf | null>();

  let someElfMoved = false;
  for (const elf of elfByCoord.values()) {
    const hasNoNeighbours = offsets.flat().every(([dx, dy]) => {
      const nx = elf.x + dx;
      const ny = elf.y + dy;
      return !elfByCoord.has(JSON.stringify([nx, ny]));
    });
    if (hasNoNeighbours) continue;

    for (const offset of offsets) {
      const hasAdjancent = offset.some(([dx, dy]) => {
        const nx = elf.x + dx;
        const ny = elf.y + dy;
        return elfByCoord.has(JSON.stringify([nx, ny]));
      });
      if (hasAdjancent) continue;

      someElfMoved = true;
      const nx = elf.x + offset[0][0];
      const ny = elf.y + offset[0][1];
      const key = JSON.stringify([nx, ny]);
      if (planned.has(key)) {
        planned.set(key, null);
      } else {
        planned.set(key, elf);
      }

      break;
    }
  }

  if (!someElfMoved) {
    console.log(i + 1);
    break;
  }

  for (const [key, elf] of planned.entries()) {
    if (!elf) continue;
    const oldKey = JSON.stringify([elf.x, elf.y]);
    const [nx, ny] = JSON.parse(key);
    elf.x = nx;
    elf.y = ny;
    elfByCoord.delete(oldKey);
    elfByCoord.set(key, elf);
  }

  offsets.push(offsets.shift()!);

  if (i === 9) {
    const [minX, maxX] = pipe(elfByCoord.values())(
      map((e) => e.x),
      extent,
    );
    const [minY, maxY] = pipe(elfByCoord.values())(
      map((e) => e.y),
      extent,
    );

    let s = 0;
    for (let x = minX!; x <= maxX!; x++) {
      for (let y = minY!; y <= maxY!; y++) {
        if (!elfByCoord.has(JSON.stringify([x, y]))) {
          s++;
        }
      }
    }
    console.log(s);
  }
}
