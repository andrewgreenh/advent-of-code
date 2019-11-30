import { DefaultDict } from '../DefaultDict';
import { filter } from '../ts-it/filter';
import { alwaysFirst } from '../ts-it/first';
import { forEach } from '../ts-it/forEach';
import { len } from '../ts-it/len';
import { map } from '../ts-it/map';
import { min } from '../ts-it/min';
import { pipe } from '../ts-it/pipe';
import { typesafeValues } from '../utils';
import { aStar, AStarConfig } from './aStar';

export interface LazyGraphConfig<DataType> {
  /**
   * Calculates cost between 2 neighbouring nodes.
   * Defaults to () => 1
   */
  getNeighbourCost?: (data1: DataType, data2: DataType) => number;

  /**
   * Returns neighbours of a given node.
   */
  getNeighbours: (data: DataType) => DataType[];

  /**
   * Returns a string representation of the node.
   * Defaults to JSON.stringify
   */
  hashData?: (data: DataType) => string;
}

export class LazyGraph<DataType> {
  private config: NonOptional<LazyGraphConfig<DataType>>;
  constructor(config: LazyGraphConfig<DataType>) {
    this.config = {
      hashData: data => JSON.stringify(data),
      getNeighbourCost: () => 1,
      ...config,
    };
  }

  findPath(
    config: Omit<AStarConfig<DataType>, keyof LazyGraphConfig<DataType>>,
  ) {
    return aStar({ ...config, ...this.config });
  }

  *topologicalSort(
    nodes: Iterable<DataType>,
    tieBraker: (iter: Iterable<DataType>) => DataType = alwaysFirst,
  ): Generator<DataType> {
    const { hashData, getNeighbours } = this.config;

    let remainingNodes = [...nodes];

    const predecessorsHashesByHash = DefaultDict(() => new Set<string>());
    for (const node of remainingNodes) {
      const nodeHash = hashData(node);
      for (const neighbour of getNeighbours(node)) {
        predecessorsHashesByHash[hashData(neighbour)].add(nodeHash);
      }
    }

    let minPredecessorCount = pipe(remainingNodes)(
      map(hashData),
      map(hash => predecessorsHashesByHash[hash]),
      map(len),
      min,
    );
    while (minPredecessorCount < Infinity) {
      let candidates = pipe(remainingNodes)(
        filter(
          n =>
            predecessorsHashesByHash[hashData(n)].size === minPredecessorCount,
        ),
      );

      const next = tieBraker(candidates);
      yield next;
      pipe(predecessorsHashesByHash)(
        typesafeValues,
        forEach(s => s.delete(hashData(next))),
      );

      remainingNodes = remainingNodes.filter(
        n => hashData(n) !== hashData(next),
      );

      minPredecessorCount = pipe(remainingNodes)(
        map(hashData),
        map(hash => predecessorsHashesByHash[hash]),
        map(len),
        min,
      );
    }
  }

  components(nodes: DataType[]) {
    const sortedNodes = [...this.topologicalSort(nodes)];
    const addedToGroup = new Set<string>();
    const groups = [] as DataType[][];

    while (addedToGroup.size !== sortedNodes.length) {
      const start = sortedNodes.find(
        n => !addedToGroup.has(this.config.hashData(n)),
      )!;
      const queue = [start];
      const group = [start];
      addedToGroup.add(this.config.hashData(start));
      while (queue.length) {
        const next = queue.pop()!;
        for (const n of this.config.getNeighbours(next)) {
          if (addedToGroup.has(this.config.hashData(n))) continue;
          addedToGroup.add(this.config.hashData(n));
          group.push(n!);
          queue.push(n!);
        }
      }
      groups.push(group);
    }
    return groups;
  }
}
