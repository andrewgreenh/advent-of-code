import getInput from '../lib/getInput';
import { flatMap } from '../lib/ts-it/flatMap';
import { join } from '../lib/ts-it/join';
import { map } from '../lib/ts-it/map';
import { min } from '../lib/ts-it/min';
import { pipe } from '../lib/ts-it/pipe';
import { range } from '../lib/ts-it/range';

const input = getInput(5, 2018);

const regex = pipe(range(0, 26))(
  map(i => String.fromCharCode(i + 97)),
  flatMap(c => [
    c.toLowerCase() + c.toUpperCase(),
    c.toUpperCase() + c.toLowerCase(),
  ]),
  join('|'),
  s => new RegExp(`(${s})`, 'g'),
);

function collapse(s) {
  while (true) {
    const collapsed = s.replace(regex, '');
    if (collapsed === s) return collapsed.length;
    s = collapsed;
  }
}

console.log(collapse(input));

const result = pipe(range(0, 26))(
  map(s =>
    input.replace(
      new RegExp(String.fromCharCode(97 + s), 'gi'),
      '',
    ),
  ),
  map(without => collapse(without)),
  min,
);

console.log(result);
