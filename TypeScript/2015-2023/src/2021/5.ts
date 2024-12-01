import getInput from '../lib/getInput';
import { LinePainter } from '../lib/LinePainter';
import { stringToLines } from '../lib/ts-it/lines';

const input = getInput(5, 2021);
const lines = stringToLines(input);

let p1 = new LinePainter();
let p2 = new LinePainter();

for (const line of lines) {
  const [[x1, y1], [x2, y2]] = LinePainter.parse(line);
  if (x1 === x2 || y1 === y2) p1.paint([x1, y1], [x2, y2]);
  p2.paint([x1, y1], [x2, y2]);
}

const result1 = p1.grid
  .toGrid()
  .flat()
  .filter((x) => x >= 2).length;
const result2 = p2.grid
  .toGrid()
  .flat()
  .filter((x) => x >= 2).length;

console.log(result1, result2);
