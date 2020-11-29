import { toArray } from '../ts-it/toArray';
import { whenPresent } from '../utils';
import { LazyGraph } from './LazyGraph';

const definition = [
  ['a', 'e'],
  ['e', 'd'],
  ['c', 'b'],
];
const lazyGraph = new LazyGraph<string>({
  getNeighbours: (char) =>
    whenPresent(
      definition.find((d) => d[0] === char),
      (d) => [d[1]],
    ) ?? [],
});
const actualComponents = toArray(
  lazyGraph.components(['a', 'b', 'c', 'd', 'e']),
);
console.log(JSON.stringify(actualComponents, null, 2));
