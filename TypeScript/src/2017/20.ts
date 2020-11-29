import _ from 'lodash';
import getInput from '../lib/getInput';
import { lines } from '../lib/ts-it/lines';
import { range } from '../lib/ts-it/range';

type Vector = [number, number, number];
type Particle = { p: Vector; v: Vector; a: Vector };

let add: (a: Vector, b: Vector) => Vector = (a, b) =>
  a.map((e, index) => e + b[index]) as Vector;

let particles: Particle[] = [];
for (let line of lines(getInput(20, 2017)) as IterableIterator<any>) {
  let [p, v, a] = line
    .split(', ')
    .map((split) => split.match(/-?\d+/g).map(Number));
  particles.push({ p, v, a });
}
let getSum = (of) => (p) => _.sum(p[of].map((x) => Math.abs(x)));
let closest = _(particles).sortBy(getSum('v')).sortBy(getSum('a')).value()[0];
console.log(particles.indexOf(closest));

for (let i of range(0, 1000)) {
  particles = _(_.groupBy(particles, (p) => p.p.join('-')))
    .reject((ps) => ps.length > 1)
    .flatten()
    .value();
  for (let p of particles) {
    p.v = add(p.v, p.a);
    p.p = add(p.p, p.v);
  }
}
console.log(particles.length);
