import { DefaultDict } from '../lib/DefaultDict';
import getInput from '../lib/getInput';
import { range } from '../lib/ts-it/range';
import { squareOfSize } from '../lib/ts-it/squareCoords';

const input = +getInput(11, 2018);

function pow([x, y], t) {
  let p = ((x + 10) * y + t) * (x + 10);
  return parseInt(p.toString().slice(-3, -2)) - 5;
}

let [cache, max, c] = [DefaultDict(Number), -Infinity, [-1, -1, -1]];
for (const s of range(1, 20)) {
  for (const [x, y] of squareOfSize(300 - s)) {
    let p = cache[`${x}-${y}`];
    for (const xx of range(x, x + s)) p += pow([xx, y + s - 1], input);
    for (const yy of range(y, y + s)) p += pow([x + s - 1, yy], input);
    cache[`${x}-${y}`] = p;
    if (p >= max) (max = p), (c = [x, y, s]);
  }
  if (s === 3 || s === 19) console.log(c.join(','));
}
