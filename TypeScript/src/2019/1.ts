import getInput from '../lib/getInput';
import { floor } from '../lib/math/floor';
import { iterable } from '../lib/ts-it/iterable';
import { lines as stringToLines } from '../lib/ts-it/lines';
import { map } from '../lib/ts-it/map';
import { pipe } from '../lib/ts-it/pipe';
import { sum } from '../lib/ts-it/sum';

const input = getInput(1, 2019);
const lines = iterable(() => stringToLines(input));

let baseCalc = (n: number) => floor(n / 3) - 2;
let recursive = (n: number): number =>
  baseCalc(n) < 0 ? 0 : baseCalc(n) + recursive(baseCalc(n));

let solve = (calc: typeof baseCalc) => pipe(lines)(map(Number), map(calc), sum);

console.log(solve(baseCalc));
console.log(solve(recursive));
