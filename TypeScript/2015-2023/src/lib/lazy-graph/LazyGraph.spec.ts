import { firstOrFail } from '../ts-it/first';
import { sort } from '../ts-it/sort';
import { toArray } from '../ts-it/toArray';
import { whenPresent } from '../utils';
import { LazyGraph } from './LazyGraph';

describe('lazy-graph', () => {
  describe('topologicalSort', () => {
    it('should sort correctly in simple cases', () => {
      const definition = [
        ['a', 'b'],
        ['b', 'c'],
        ['c', 'd'],
        ['d', 'e'],
      ];
      const expectedOrder = ['a', 'b', 'c', 'd', 'e'];
      const lazyGraph = new LazyGraph<string>({
        getNeighbours: (char) =>
          whenPresent(
            definition.find((d) => d[0] === char),
            (d) => [d[1]],
          ) ?? [],
      });

      const actualOrder = toArray(
        lazyGraph.topologicalSort(['a', 'b', 'c', 'd', 'e']),
      );

      expect(actualOrder).toEqual(expectedOrder);
    });

    it('should use the tiebraker for ties', () => {
      const definition = [
        ['a', 'c'],
        ['b', 'c'],
        ['c', 'd'],
        ['d', 'e'],
      ];
      const expectedOrder = ['a', 'b', 'c', 'd', 'e'];
      const lazyGraph = new LazyGraph<string>({
        getNeighbours: (char) =>
          whenPresent(
            definition.find((d) => d[0] === char),
            (d) => [d[1]],
          ) ?? [],
      });

      const actualOrder = toArray(
        lazyGraph.topologicalSort(['a', 'b', 'c', 'd', 'e'], (chars) =>
          firstOrFail(sort<string>()(chars)),
        ),
      );

      expect(actualOrder).toEqual(expectedOrder);
    });

    it('should use the tiebraker for ties and should handle bipartit graphs', () => {
      const definition = [
        ['a', 'e'],
        ['e', 'd'],
        ['c', 'b'],
      ];
      const expectedOrder = ['a', 'c', 'b', 'e', 'd'];
      const lazyGraph = new LazyGraph<string>({
        getNeighbours: (char) =>
          whenPresent(
            definition.find((d) => d[0] === char),
            (d) => [d[1]],
          ) ?? [],
      });

      const actualOrder = toArray(
        lazyGraph.topologicalSort(['a', 'b', 'c', 'd', 'e'], (chars) =>
          firstOrFail(sort<string>()(chars)),
        ),
      );

      expect(actualOrder).toEqual(expectedOrder);
    });
  });

  describe('components', () => {
    it('should return correct components', () => {
      const definition = [
        ['a', 'e'],
        ['e', 'd'],
        ['c', 'b'],
      ];
      const expectedComponents = [
        ['a', 'e', 'd'],
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
      expect(actualComponents).toEqual(expectedComponents);
    });
  });
});
