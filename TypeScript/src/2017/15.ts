import { filter } from '../lib/ts-it/filter';
import { len } from '../lib/ts-it/len';
import { pipe } from '../lib/ts-it/pipe';
import { seqOf } from '../lib/ts-it/seqOf';
import { take } from '../lib/ts-it/take';
import { zip } from '../lib/ts-it/zip';

let [factorA, factorB] = [16807, 48271];
let [a, b] = [703, 516];

let getGen = (num: number, factor: number) =>
  seqOf(() => (num = (num * factor) % (2 ** 31 - 1)));

let count = 40000000;
let pairs = zip<number, number>(getGen(a, factorA), getGen(b, factorB));

// let count = 5000000
// let pairs = zip<number, number>(
//   filter<number>(x => x % 4 === 0)(getGen(a, factorA)),
//   filter<number>(x => x % 8 === 0)(getGen(b, factorB)),
// )

let result = pipe(pairs)(
  take(count),
  filter(([a, b]) => (a & 0xffff) === (b & 0xffff)),
  len,
);
console.log(result);
