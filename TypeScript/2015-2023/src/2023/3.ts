import { range } from 'remeda';
import { asyncGetInput } from '../lib/getInputAsync';
import { stringToLines } from '../lib/ts-it/lines';

const input = await asyncGetInput(3, 2023);
const lines = stringToLines(input);

const allNums = [] as { num: number; rowIndex: number; colIndex: number }[];
lines.forEach((line, lineIndex) => {
  let num = '';
  let startIndex = null as number | null;
  line.split('').forEach((char, charIndex) => {
    if (char.match(/\d/)) {
      num += char;
      if (startIndex === null) startIndex = charIndex;
    } else if (startIndex !== null) {
      allNums.push({ num: +num, rowIndex: lineIndex, colIndex: startIndex });
      num = '';
      startIndex = null;
    }
  });
  if (startIndex !== null) {
    allNums.push({ num: +num, rowIndex: lineIndex, colIndex: startIndex });
    num = '';
    startIndex = null;
  }
});

const specialChars = input.match(/[^0-9.\n]/g)!.slice(1);
const numsWithNeighbours = allNums.map((num) => {
  const neighbours = [
    {
      x: num.colIndex - 1,
      y: num.rowIndex,
      char: lines[num.rowIndex][num.colIndex - 1],
    },
    {
      x: num.colIndex + String(num.num).length,
      y: num.rowIndex,
      char: lines[num.rowIndex][num.colIndex + String(num.num).length],
    },
    ...range(
      num.colIndex - 1,
      num.colIndex + String(num.num).length + 1,
    ).flatMap((x) => [
      { x: x, y: num.rowIndex - 1, char: lines[num.rowIndex - 1]?.[x] },
      { x: x, y: num.rowIndex + 1, char: lines[num.rowIndex + 1]?.[x] },
    ]),
  ].filter(({ char }) => char !== undefined);
  return { num, neighbours };
});

const part1 = numsWithNeighbours
  .filter(({ neighbours }) =>
    neighbours.some(({ char }) => specialChars.includes(char)),
  )
  .reduce((a, b) => a + b.num.num, 0);
const part2 = lines
  .flatMap((line, lineIndex) =>
    line.split('').map((char, charIndex) => {
      if (char !== '*') return 0;
      const neighbours = numsWithNeighbours.filter(({ neighbours }) =>
        neighbours.some(({ x, y }) => x === charIndex && y === lineIndex),
      );
      if (neighbours.length === 2)
        return neighbours[0].num.num * neighbours[1].num.num;
      return 0;
    }),
  )
  .reduce((a, b) => a + b);

console.log(part1, part2);
