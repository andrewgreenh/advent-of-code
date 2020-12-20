import { memoize, range, toArray } from 'lodash';
import getInput from '../lib/getInput';
import { flip } from '../lib/ts-it/flip';
import { map } from '../lib/ts-it/map';
import { numbers } from '../lib/ts-it/numbers';
import { p } from '../lib/ts-it/pipe';
import { printGrid } from '../lib/ts-it/printGrid';
import { rotate } from '../lib/ts-it/rotate';
import { toGrid } from '../lib/ts-it/toGrid';

const input = getInput(20, 2020);
const parts = input.split('\n\n').map((part) => {
  const [head, ...body] = part.split('\n');
  const id = numbers(head)[0];
  const tile = body.map((line) => line.split(''));
  return [id, tile] as [number, string[][]];
});
const side = Math.sqrt(parts.length);
type Part = typeof parts[number];

function eagerGrid(grid: Iterable<Iterable<unknown>>): string[][] {
  return p(grid)(map(toArray), toArray);
}

const allRotations = memoize(function allRotations(tile: string[][]) {
  const result: string[][][] = [];
  result.push(tile);
  result.push(p(tile)(rotate<string>(), eagerGrid));
  result.push(p(tile)(rotate<string>(), rotate<string>(), eagerGrid));
  result.push(
    p(tile)(rotate<string>(), rotate<string>(), rotate<string>(), eagerGrid),
  );
  const flipped = eagerGrid(flip<string>()(tile));
  result.push(flipped);
  result.push(p(flipped)(rotate<string>(), eagerGrid));
  result.push(p(flipped)(rotate<string>(), rotate<string>(), eagerGrid));
  result.push(
    p(flipped)(rotate<string>(), rotate<string>(), rotate<string>(), eagerGrid),
  );
  return result;
});

// for (const t of allRotations(parts[0][1])) {
//   printGrid(t, '', '');
// }

function doesFit(
  fixedTiles: (Part | null)[][],
  nextX: number,
  nextY: number,
  nextPart: string[][],
): boolean {
  const isLeftMost = nextX === 0;
  const isTopMost = nextY === 0;

  const tileAbove = fixedTiles[nextY - 1]?.[nextX]?.[1];
  const tileLeft = fixedTiles[nextY]?.[nextX - 1]?.[1];

  const topFits =
    isTopMost ||
    range(0, nextPart[0].length).every(
      (i) => tileAbove![nextPart.length - 1][i] === nextPart[0][i],
    );
  const leftFits =
    isLeftMost ||
    range(0, nextPart.length).every(
      (i) => tileLeft![i][nextPart[0].length - 1] === nextPart[i][0],
    );
  return topFits && leftFits;
}

function printGridOfGrids(fixedTiles: (Part | null)[][]) {
  for (const y of range(0, side * parts[0][1].length)) {
    if (y % parts[0][1].length === 0) console.log('\n');
    let row = '';
    for (const x of range(0, side * parts[0][1][0].length)) {
      if (x % parts[0][1][0].length === 0) row += ' ';
      const tileX = Math.floor(x / parts[0][1][0].length);
      const tileY = Math.floor(y / parts[0][1].length);
      const tile = fixedTiles[tileY][tileX]?.[1];
      const innerX = x % parts[0][1][0].length;
      const innerY = y % parts[0][1].length;
      const char = tile?.[innerY]?.[innerX] ?? '';
      row += char;
    }
    console.log(row);
  }
}

function* findSolution(
  fixedTiles: (Part | null)[][],
  nextIndex: number,
): Generator<(Part | null)[][]> {
  if (nextIndex === side * side) yield fixedTiles;

  const nextX = nextIndex % side;
  const nextY = Math.floor(nextIndex / side);

  const possibleParts = parts.filter((p) =>
    fixedTiles.every((row) => row.every((i) => p[0] !== i?.[0])),
  );
  for (const possiblePart of possibleParts) {
    for (const rotation of allRotations(possiblePart[1])) {
      if (doesFit(fixedTiles, nextX, nextY, rotation)) {
        const newTiles = [...fixedTiles].map((line) => [...line]);
        newTiles[nextY][nextX] = [possiblePart[0], rotation];
        yield* findSolution(newTiles, nextIndex + 1);
      }
    }
  }
}

const emptyResult = p(new Array<null>(parts.length).fill(null))(toGrid(side));
for (const x of findSolution(emptyResult, 0)) {
  printGrid(x.map((row) => row.map((c) => c![0])));
  let s = 1;
  for (const row of [x[0], x[x.length - 1]]) {
    s *= row[0]![0];
    s *= row[row.length - 1]![0];
  }
  console.log(s);
  printGridOfGrids(x);
  break;
}
