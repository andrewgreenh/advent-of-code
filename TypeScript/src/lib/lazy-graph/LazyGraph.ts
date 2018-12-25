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

  topologicalSort(nodes: DataType[]) {
    throw new Error('Not implemented yet.');
  }

  components(nodes: DataType[]) {
    const addedToGroup = new Set<string>();
    const groups = [] as DataType[][];
    while (addedToGroup.size !== nodes.length) {
      const start = nodes.find(
        n => !addedToGroup.has(this.config.hashData(n)),
      )!;
      const queue = [start];
      const group = [start];
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
