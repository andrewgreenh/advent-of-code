import getInput from '../lib/getInput';
import { extent } from '../lib/ts-it/extent';
import { stringToLines } from '../lib/ts-it/lines';
import { range } from '../lib/ts-it/range';

const input = getInput(17, 2020);
const lines = stringToLines(input);

type P = [number, number, number, number];
const key = (p: P) => p.join('/');
const parse = (s: string) => (s.split('/').map(Number) as any) as P;

function solve(part2 = false) {
  let grid = new Set(
    lines.flatMap((l, y) =>
      l.split('').flatMap((c, x) => (c === '#' ? [key([x, y, 0, 0])] : [])),
    ),
  );

  for (let i of range(0, 6)) {
    let copy = new Set<string>();
    let [minX, maxX] = extent([...grid.values()].map((x) => parse(x)[0]));
    let [minY, maxY] = extent([...grid.values()].map((x) => parse(x)[1]));
    let [minZ, maxZ] = extent([...grid.values()].map((x) => parse(x)[2]));
    let [minW, maxW] = extent([...grid.values()].map((x) => parse(x)[3]));

    for (let x of range(minX! - 1, maxX! + 2)) {
      for (let y of range(minY! - 1, maxY! + 2)) {
        for (let z of range(minZ! - 1, maxZ! + 2)) {
          for (let w of part2 ? range(minW! - 1, maxW! + 2) : [0]) {
            let n = 0;
            for (let dx of range(-1, 2))
              for (let dy of range(-1, 2))
                for (let dz of range(-1, 2))
                  for (let dw of range(-1, 2))
                    if (
                      (dx !== 0 || dy !== 0 || dz !== 0 || dw !== 0) &&
                      grid.has(key([x + dx, y + dy, z + dz, w + dw]))
                    )
                      n++;

            if (grid.has(key([x, y, z, w]))) {
              if ([2, 3].includes(n)) copy.add(key([x, y, z, w]));
            } else {
              if (n === 3) copy.add(key([x, y, z, w]));
            }
          }
        }
      }
    }
    grid = copy;
  }

  return grid.size;
}

console.log(solve());
console.log(solve(true));
