import { range } from '../lib/ts-it/range';
import { sum } from '../lib/ts-it/sum';

let states = {
  a: [i => [1, i + 1, states.b], i => [0, i - 1, states.d]],
  b: [i => [1, i + 1, states.c], i => [0, i + 1, states.f]],
  c: [i => [1, i - 1, states.c], i => [1, i - 1, states.a]],
  d: [i => [0, i - 1, states.e], i => [1, i + 1, states.a]],
  e: [i => [1, i - 1, states.a], i => [0, i + 1, states.b]],
  f: [i => [0, i + 1, states.c], i => [0, i + 1, states.e]],
};

let [band, index, state]: any[] = [[], 10000, states.a];
for (let i of range(0, 12302209))
  [band[index], index, state] = state[band[index] || 0](index);
console.log(sum(band));
