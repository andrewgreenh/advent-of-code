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

function printGridOfGrids(fixedTiles: (Part | null)[][], spaces = true) {
  const sampleTile = fixedTiles[0][0]?.[1];
  if (!sampleTile) return;
  let rows = '';
  for (const y of range(0, fixedTiles.length * sampleTile.length)) {
    let row = '';
    if (y % sampleTile.length === 0 && spaces) row += '\n';
    for (const x of range(0, fixedTiles[0].length * sampleTile[0].length)) {
      if (x % sampleTile[0].length === 0 && spaces) row += ' ';
      const tileX = Math.floor(x / sampleTile[0].length);
      const tileY = Math.floor(y / sampleTile.length);
      const tile = fixedTiles[tileY][tileX]?.[1];
      const innerX = x % sampleTile[0].length;
      const innerY = y % sampleTile[0].length;
      const char = tile?.[innerY]?.[innerX] ?? '';
      row += char;
    }
    rows += row + '\n';
  }
  console.log(rows);
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
  printGridOfGrids(x);
  console.log(s);

  const partsWithoutBorders = x.map((rowOfParts) =>
    rowOfParts.map(
      (part): Part => [
        part![0],
        part![1].slice(1, -1).map((row) => row.slice(1, -1)),
      ],
    ),
  );

  printGridOfGrids(partsWithoutBorders, false);

  const baseNessy = `..................#.
#....##....##....###
.#..#..#..#..#..#...`
    .split('\n')
    .map((l) => l.split(''));

  const allNessies = allRotations(baseNessy);

  const sampleTile = partsWithoutBorders[0][0][1];

  const maxY = sampleTile.length * partsWithoutBorders.length;
  const maxX = sampleTile[0].length * partsWithoutBorders[0].length;

  for (const nessy of allNessies) {
    for (let y of range(0, maxY - nessy.length)) {
      for (let x of range(0, maxX - nessy[0].length)) {
        let matches = true;
        for (let dy of range(0, nessy.length)) {
          for (let dx of range(0, nessy[0].length)) {
            const totalX = x + dx;
            const totalY = y + dy;
            const tileX = Math.floor(totalX / sampleTile[0].length);
            const tileY = Math.floor(totalY / sampleTile.length);
            const localX = totalX % sampleTile[0].length;
            const localY = totalY % sampleTile.length;

            if (
              partsWithoutBorders[tileY][tileX][1][localY][localX] === '.' &&
              nessy[dy][dx] === '#'
            )
              matches = false;
          }
        }
        if (matches) {
          for (let dy of range(0, nessy.length)) {
            for (let dx of range(0, nessy[0].length)) {
              const totalX = x + dx;
              const totalY = y + dy;
              const tileX = Math.floor(totalX / sampleTile[0].length);
              const tileY = Math.floor(totalY / sampleTile.length);
              const localX = totalX % sampleTile[0].length;
              const localY = totalY % sampleTile.length;

              if (nessy[dy][dx] === '#')
                partsWithoutBorders[tileY][tileX][1][localY][localX] = 'O';
            }
          }
        }
      }
    }
  }
  printGridOfGrids(partsWithoutBorders, false);

  let s2 = 0;
  for (let partRow of partsWithoutBorders) {
    for (let part of partRow) {
      for (let tileRow of part[1]) {
        for (let c of tileRow) {
          if (c === '#') s2++;
        }
      }
    }
  }

  console.log(s2);

  break;
}
