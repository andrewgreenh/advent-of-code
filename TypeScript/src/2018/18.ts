import getInput from '../lib/getInput';
import { countItem } from '../lib/ts-it/countItem';
import { flatten } from '../lib/ts-it/flatten';
import { stringToLines } from '../lib/ts-it/lines';
import { map } from '../lib/ts-it/map';
import { pipe } from '../lib/ts-it/pipe';
import { range } from '../lib/ts-it/range';
import { squareAround } from '../lib/ts-it/squareCoords';

let acre: string[][] = [...stringToLines(getInput(18, 2018))].map((i) =>
  i.split(''),
);
const [wCount, lCount] = [countItem('|'), countItem('#')];

for (const i of range(0, 10)) {
  acre = acre.map((line, y) =>
    line.map((char, x) => {
      const b = [
        ...pipe(squareAround([x, y]))(map(([x, y]) => (acre[y] || [])[x])),
      ];
      if (char === '.' && wCount(b) >= 3) return '|';
      if (char === '|' && lCount(b) >= 3) return '#';
      if (char === '#' && lCount(b) >= 1 && wCount(b) >= 1) return '#';
      if (char === '#') return '.';
      return char;
    }),
  );
}
let w = pipe(acre)((x) => flatten<string>(x), countItem('|'));
let l = pipe(acre)((x) => flatten<string>(x), countItem('#'));

console.log(w * l);

const cycle = [
  194029,
  193688,
  195836,
  193795,
  194256,
  194820,
  195160,
  195702,
  198702,
  200208,
  201492,
  201722,
  198950,
  196308,
  196196,
  194598,
  193795,
  191760,
  191520,
  189501,
  189720,
  187040,
  189057,
  189044,
  190046,
  189001,
  192764,
  192192,
];
console.log(cycle[1000000000 % cycle.length]);
