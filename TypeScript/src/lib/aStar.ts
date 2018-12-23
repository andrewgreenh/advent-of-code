import * as _ from 'lodash';

import Heap from './Heap';

export interface AStarConfig<DataType> {
  /**
   * Used to estimate remaining cost of a node. MUST NOT overestimate the cost.
   * Defaults to () => 0
   */
  estimateCost?: (data: DataType) => number;

  /**
   * Calculates cost between 2 neighbour nodes.
   * Defaults to () => 1
   */
  getNeighbourCost?: (data1: DataType, data2: DataType) => number;

  /**
   * Returns neighbours of a given node.
   */
  getNeighbours: (data: DataType) => DataType[];

  /**
   * Returns a string representation of the node.
   * Defaults to toString()
   */
  hashData?: (data: DataType) => string;

  /**
   * Order in which the nodes get expanded. Return negative number if a should come before b.
   * Defaults to a.f - b.f
   */
  heapComperator?: (
    node1: AStarNode<DataType>,
    node2: AStarNode<DataType>,
  ) => number;

  /**
   * Determines if node is the goal.
   */
  isEnd: (data: DataType) => boolean;

  /**
   * When maxCosts is given, the algorithm stops when maxCosts is reached
   * Defaults to Infinity
   */
  maxCosts?: number;

  // First node in the open list
  startNode: DataType;
}

interface AStarNode<DataType> {
  data: DataType;

  // Current costs to reach this node
  g: number;

  // Estimated remaining costs for this node.
  h: number;

  // Sum of g and h. This is the cost value that is used to determine next nodes.
  f: number;

  // Identifier for this data node. Used to prevent duplicates.
  hash: string;

  previousNode?: AStarNode<DataType>;
}

export function aStar<DataType>(config: AStarConfig<DataType>) {
  const {
    estimateCost = () => 0,
    getNeighbourCost = () => 1,
    getNeighbours,
    hashData = (x: { toString: () => string }) => x.toString(),
    heapComperator = (a: AStarNode<DataType>, b: AStarNode<DataType>) =>
      a.f - b.f,
    isEnd,
    maxCosts = Infinity,
    startNode: startData,
  } = config;

  const shouldNodeComeBeforeNode = (
    a: AStarNode<DataType>,
    b: AStarNode<DataType>,
  ) => heapComperator(a, b) < 0;

  const startNode = {
    data: startData,
    g: 0,
    h: estimateCost(startData),
    f: estimateCost(startData),
    hash: hashData(startData),
  };
  const openNodesByHash = new Map<string, AStarNode<DataType>>();
  const openNodes = new Heap(shouldNodeComeBeforeNode);
  const closedNodesByHash = new Map<string, AStarNode<DataType>>();

  openNodesByHash.set(startNode.hash, startNode);
  openNodes.add(startNode);

  let counter = 0;
  while (openNodes.size !== 0) {
    const node = openNodes.pop() as AStarNode<DataType>;
    if (!openNodesByHash.has(node.hash)) continue;
    openNodesByHash.delete(node.hash);

    closedNodesByHash.set(node.hash, node);
    if (isEnd(node.data)) return finish(node, counter, closedNodesByHash);
    if (node.g > maxCosts) return finish(node, counter, closedNodesByHash);
    counter++;

    const neighbourData = getNeighbours(node.data);
    for (let i = 0; i < neighbourData.length; i++) {
      const currentData = neighbourData[i];
      const hash = hashData(currentData);
      if (closedNodesByHash.has(hash)) continue;
      const g = node.g + getNeighbourCost(node.data, currentData);

      const existingNode = openNodesByHash.get(hash);
      if (existingNode !== undefined && g >= existingNode.g) continue;

      const h = estimateCost(currentData);
      const neighbourNode = {
        data: currentData,
        f: g + h,
        h,
        g,
        hash,
        previousNode: node,
      };
      openNodesByHash.set(hash, neighbourNode);
      openNodes.add(neighbourNode);
    }
  }
  return fail(closedNodesByHash, counter);
}

export interface AStarResult<T> {
  status: string;
  expandedNodeCounter: number;
  getExpandedNodes: () => IterableIterator<AStarNode<T>>;
  isFail: (this: AStarResult<T>) => this is AStarFailResult<T>;
  isSuccess: (this: AStarResult<T>) => this is AStarSuccessResult<T>;
}

export interface AStarFailResult<T> extends AStarResult<T> {
  status: 'Fail :(';
}

export interface AStarSuccessResult<T> extends AStarResult<T> {
  cost: number;
  target: AStarNode<T>;
  getPath: () => AStarNode<T>[];
}

function fail<T>(
  closedNodesByHash: Map<string, AStarNode<T>>,
  counter: number,
): AStarFailResult<T> {
  return {
    expandedNodeCounter: counter,
    getExpandedNodes: () => closedNodesByHash.values(),
    isFail: () => true,
    isSuccess: () => false,
    status: 'Fail :(',
  };
}

function finish<T>(
  node: AStarNode<T>,
  counter: number,
  closedNodesByHash: Map<string, AStarNode<T>>,
): AStarSuccessResult<T> {
  const path = recursiveNodeToArray(node);
  return {
    cost: node.g,
    expandedNodeCounter: counter,
    getExpandedNodes: () => closedNodesByHash.values(),
    getPath: () => path,
    isFail: () => false,
    isSuccess: () => true,
    status: 'success',
    target: path[path.length - 1],
  };
}

function recursiveNodeToArray<T>(node: AStarNode<T>) {
  const result: Omit<AStarNode<T>, 'previousNode'>[] = [];
  let current = node;
  while (current) {
    result.unshift(_.omit(current, 'previousNode') as AStarNode<T>);
    current = current.previousNode as AStarNode<T>;
  }
  return result;
}
