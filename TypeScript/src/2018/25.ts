import getInput from '../lib/getInput';
import { LazyGraph } from '../lib/lazy-graph/LazyGraph';
import { lines } from '../lib/ts-it/lines';
import { map } from '../lib/ts-it/map';
import { numbers } from '../lib/ts-it/numbers';
import { pipe } from '../lib/ts-it/pipe';
import { sum } from '../lib/ts-it/sum';
import { toArray } from '../lib/ts-it/toArray';
import { zip } from '../lib/ts-it/zip';

const points = pipe(getInput(25, 2018))(lines, map(numbers), toArray);
const abs = Math.abs;
const graph = new LazyGraph<number[]>({
  getNeighbours: a =>
    points.filter(b => pipe(zip(a, b))(map(([a, b]) => abs(a - b)), sum) <= 3),
});
const components = graph.components(points);

console.log(components.length);
