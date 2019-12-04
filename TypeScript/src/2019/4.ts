import getInput from '../lib/getInput';
import { any } from '../lib/ts-it/any';
import { countBy } from '../lib/ts-it/countBy';
import { every } from '../lib/ts-it/every';
import { filter } from '../lib/ts-it/filter';
import { map } from '../lib/ts-it/map';
import { p } from '../lib/ts-it/pipe';
import { range } from '../lib/ts-it/range';
import slide from '../lib/ts-it/slide';
import { tap } from '../lib/ts-it/tap';
import { toArray } from '../lib/ts-it/toArray';
import { values } from '../lib/utils';

const input = getInput(4, 2019);
const [start, end] = input.split('-').map(Number);

p(range(start, end))(
  map(x => [...x.toString()]),
  filter(s => {
    const doubles = p(s)(
      countBy(),
      values,
      any(x => x >= 2),
    );
    const monotone = p(s)(
      slide(2),
      every(([a, b]) => +a <= +b),
    );
    return !!doubles && monotone;
  }),
  toArray,
  tap(a => console.log(a.length)),
  filter(n => {
    const onlyDoubles = p(n.toString())(
      countBy(),
      values,
      any(x => x === 2),
    );
    return onlyDoubles;
  }),
  toArray,
  tap(a => console.log(a.length)),
);
