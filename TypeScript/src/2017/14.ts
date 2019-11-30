import * as _ from 'lodash';

import getInput from '../lib/getInput';
import { knotHash } from '../lib/knotHash';
import { flatMap } from '../lib/ts-it/flatMap';
import { map } from '../lib/ts-it/map';
import { range } from '../lib/ts-it/range';
import { sum } from '../lib/ts-it/sum';

let input = getInput(14, 2017).trim();
let grid: string[][] = [];
let count = 0;
for (let i of range(0, 128)) {
  let hex = knotHash(`${input}-${i}`, 64);
  let bin = [
    ...flatMap<string, string>(x =>
      _.padStart(parseInt(x, 16).toString(2), 4, '0'),
    )(hex),
  ];
  grid.push(bin);
  count += sum(map(Number)(bin));
}
console.log(count);

let strGrid: string[][] = grid.map(x => x.map(y => (y === '1' ? '#' : '.')));
let num = 1;
strGrid.forEach((r, rIdx) =>
  r.forEach((c, cIdx) => (c === '#' ? mark([rIdx, cIdx], num++) : null)),
);

function mark([rIdx, cIdx]: number[], _?) {
  if (!strGrid[rIdx] || !strGrid[rIdx][cIdx] || strGrid[rIdx][cIdx] !== '#')
    return;
  strGrid[rIdx][cIdx] = `${num}`;
  [
    [rIdx + 1, cIdx],
    [rIdx, cIdx + 1],
    [rIdx - 1, cIdx],
    [rIdx, cIdx - 1],
  ].forEach(mark);
}
console.log(num - 1);
