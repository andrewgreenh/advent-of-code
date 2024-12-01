import { floor, max, min, range } from 'lodash';
import getInput from '../lib/getInput';
import { stringToLines } from '../lib/ts-it/lines';

const input = getInput(24, 2021);
const lines = stringToLines(input);

const divisionIndex = 4;
const xOffsetIndex = 5;
const yOffsetIndex = 15;

const getNum = (line: number) => Number(lines[line].split(' ')[2]);
const getNums = (offset: number) =>
  range(0, 14)
    .map((n) => n * 18 + offset)
    .map(getNum);

const divisions = getNums(divisionIndex);
const xOffset = getNums(xOffsetIndex);
const yOffset = getNums(yOffsetIndex);

const zBudgets = divisions.map((x, i) =>
  divisions.slice(i).reduce((a, b) => a * b, 1),
);

const solutions = solve(0, 0);
console.log(max(solutions));
console.log(min(solutions));

function solve(z: number, i: number): string[] {
  if (i === 14 && z === 0) return [''];
  if (i === 14) return [];
  return range(1, 10).flatMap((w) => {
    const newZ = step(z, i, w);
    if (newZ > zBudgets[i + 1]) return [];
    return solve(newZ, i + 1).map((s) => w + s);
  });
}

function step(z: number, i: number, w: number): number {
  let x = xOffset[i] + (z % 26);
  z = floor(z / divisions[i]);
  if (x != w) z = z * 26 + w + yOffset[i];
  return z;
}
