import getInput from '../lib/getInput';
import { log } from '../lib/log';
import { floor } from '../lib/math/floor';
import { iterable } from '../lib/ts-it/iterable';
import { lines as stringToLines } from '../lib/ts-it/lines';

const input = getInput(1, 2019);
const lines = iterable(() => stringToLines(input));

let resA = 0;
let resB = 0;
for (let l of lines) {
  let f = floor(+l / 3) - 2;
  resA += f;
  while (f > 0) {
    resB += f;
    f = floor(f / 3) - 2;
  }
}
log(resA, resB);
