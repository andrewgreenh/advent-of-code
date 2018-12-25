import { maxBy } from './maxBy';
import { pipe } from './pipe';

const x = [
  { n: 1, a: 5, b: 6, c: 7 },
  { n: 2, a: 5, b: 6, c: 6 },
  { n: 3, a: 4, b: 4, c: 6 },
];
const r = pipe(x)(maxBy(x => [x.b, x.a, x.c]));
console.log(r);
