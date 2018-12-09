import { DefaultDict } from '../lib/DefaultDict';
import { Deque } from '../lib/Deque';
import getInput from '../lib/getInput';
import { max } from '../lib/ts-it/max';
import { numbers } from '../lib/ts-it/numbers';
import { range } from '../lib/ts-it/range';

let [p, m] = numbers(getInput(9, 2018));

m *= 100;

const d = new Deque(0);
const c = DefaultDict(Number);

for (const i of range(1, m + 1)) {
  if (i % 23) d.rotate(-2), d.unshift(i);
  else d.rotate(6), (c[i % p] += i + d.pop()!);
}

console.log(max(Object.values(c)));
