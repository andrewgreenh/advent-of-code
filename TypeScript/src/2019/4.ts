import getInput from '../lib/getInput';
import { str } from '../lib/str';
import { any } from '../lib/ts-it/any';
import { countBy } from '../lib/ts-it/countBy';
import { pipe } from '../lib/ts-it/pipe';
import { range } from '../lib/ts-it/range';
import { values } from '../lib/utils';

const input = getInput(4, 2019);
const [start, end] = input.split('-').map(Number);

let [a, b] = [0, 0];
for (let x of range(start, end)) {
  let s = [...str(x)];
  if (s.join('') !== s.sort().join('')) continue;
  let c = pipe(s)(countBy(), values);
  if (!pipe(c)(any(x => x >= 2))) continue;
  a++;
  if (!pipe(c)(any(x => x === 2))) continue;
  b++;
}
console.log(a, b);
